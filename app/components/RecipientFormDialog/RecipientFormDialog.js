import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose, Mutation, Query } from 'react-apollo'
import ContactList from '../ContactList'
import RecipientForm from '../RecipientForm'
import AddIcon from '@material-ui/icons/Add'
import { CONTACTS_QUERY, ORDER_CONTACTS_QUERY } from '../../graphql/queries'
import { CREATE_CONTACT, UPDATE_CONTACT } from '../../graphql/mutations'
import Modal from 'antd/lib/modal'
import styles from './styles.scss'
import Button from 'antd/lib/button'

const ID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

class RecipientFormDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
    order: PropTypes.object
  }

  static defaultProps = {
    open: false
  }

  onChange = (element) => {
    const { order: { data: { currentOrder } } } = this.props
    const variables = { id: currentOrder.id }
    const data = this.props.client.readQuery({
      query: ORDER_CONTACTS_QUERY,
      variables
    })
    this.props.client.writeQuery({
      query: ORDER_CONTACTS_QUERY,
      variables: { id: currentOrder.id },
      data: {
        currentOrder: {
          ...data.currentOrder,
          contact: {
            ...data.currentOrder.contact,
            address: {
              ...data.currentOrder.contact.address,
              ...element
            }
          }
        }
      }
    })
  }

  selectContact = (contact) => {
    let { order: { data: { currentOrder } } } = this.props
    let orderContact = currentOrder?.contact?.id === contact.id
      ? null
      : contact

    const query = {
      query: ORDER_CONTACTS_QUERY,
      variables: { id: currentOrder.id },
      data: {
        currentOrder: {
          ...currentOrder,
          contact: orderContact
        }
      }
    }

    this.props.client.writeQuery(query)
  }

  handleClose = () => {
    const {
      order: {
        data: {
          currentOrder
        }
      }
    } = this.props

    this.props.handleClose()
      .then(() => {
        return this.props.updateOrder({
          input: {
            id: currentOrder.id,
            contact: (currentOrder?.contact?.id) || null
          }
        })
      })
  }

  updateContact = (mutate) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateContact: {
        __typename: 'Contact',
        ...variables.input
      }
    }
  })

  createContact = (mutate) => () => mutate({
    optimisticResponse: {
      __typename: 'Mutation',
      createContact: {
        __typename: 'Contact',
        id: ID(),
        address: {
          id: ID(),
          name: null,
          street: null,
          apt: null,
          city: null,
          state: null,
          postalCode: null,
          country: null,
          kind: 'RECIPIENT',
          __typename: 'Address'
        },
        orders: []
      }
    },
    update: (store, { data: { createContact } }) => {
      const data = store.readQuery({ query: CONTACTS_QUERY })
      data.contacts.push(createContact)
      store.writeQuery({ query: CONTACTS_QUERY, data })
      this.selectContact(createContact)
    }
  })

  render () {
    const {
      classes,
      order: {
        data: {
          currentOrder
        }
      }
    } = this.props
    return (
      <Query query={ORDER_CONTACTS_QUERY} variables={{ id: currentOrder?.id }} skip={!this.props.open}>
        {order => (
          <Mutation mutation={UPDATE_CONTACT}>
            {(updateContact) => (
              <Mutation mutation={CREATE_CONTACT}>
                {(createContact) => {
                  return (
                    <Modal
                      visible={this.props.open}
                      width={800}
                      title={'Shipping Address'}
                      onOK={this.handleClose}
                      onCancel={this.handleClose}
                      footer={[
                        <Button onClick={this.createContact(createContact)}>
                          Add A Contact
                        </Button>,
                        <Button onClick={this.handleClose}>Done</Button>
                      ]}
                      className={styles.modal}
                    >
                      <div className={styles.row}>Where should we send this order?</div>
                      <div className={styles.row}>
                        <div className={styles.column}>
                          <ContactList
                            selectContact={this.selectContact}
                            order={order}
                            client={this.props.client}
                          />
                        </div>
                        <div className={styles.column}>
                          <RecipientForm
                            user={this.props.user}
                            client={this.props.client}
                            order={order}
                          />
                        </div>
                      </div>
                    </Modal>
                  )
                }}
              </Mutation>
            )}
          </Mutation>
        )}
      </Query>
    )
  }
}

export default RecipientFormDialog
