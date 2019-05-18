import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import { graphql, compose, Mutation } from 'react-apollo'
import ContactList from '../ContactList'
import RecipientForm from '../RecipientForm'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { CONTACTS_QUERY, ORDER_QUERY } from '../../graphql/queries'
import { CREATE_CONTACT, UPDATE_CONTACT } from '../../graphql/mutations'
import formStyles from './styles'
import Grid from '@material-ui/core/Grid'

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
    this.props.client.writeQuery({
      query: ORDER_QUERY,
      data: {
        currentOrder: {
          ...currentOrder,
          contact: {
            ...currentOrder.contact,
            address: {
              ...currentOrder.contact.address,
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

    this.props.client.writeQuery({
      query: ORDER_QUERY,
      data: {
        currentOrder: {
          ...currentOrder,
          contact: orderContact
        }
      }
    })
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
    let contact = currentOrder?.contact
    return (
      <Mutation mutation={UPDATE_CONTACT}>
        {(updateContact) => {
          return (
            <Mutation mutation={CREATE_CONTACT}>
              {(createContact) => {
                return (
                  <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    fullScreen={window.innerWidth < 481}
                    maxWidth={false}
                    PaperProps={{
                      classes: {
                        root: this.props.classes.paper
                      }
                    }}
                  >
                    <DialogTitle>
                      Shipping Address
                    </DialogTitle>
                    <DialogContent style={{ flexGrow: 1 }}>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <DialogContentText>
                            Where should we send this order?
                          </DialogContentText>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <ContactList
                            selectContact={this.selectContact}
                            order={this.props.order}
                            client={this.props.client}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <RecipientForm
                            user={this.props.user}
                            client={this.props.client}
                            order={this.props.order}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                      <Button onClick={this.createContact(createContact)}>
                        <AddIcon /> Add A Contact
                      </Button>
                      <Button onClick={this.handleClose}>Done</Button>
                    </DialogActions>
                  </Dialog>
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default withStyles(formStyles)(RecipientFormDialog)
