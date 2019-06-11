import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import ContactListItem from '../ContactListItem'
import { DELETE_CONTACT } from '../../graphql/mutations'
import { CONTACTS_QUERY } from '../../graphql/queries'
import List from 'antd/lib/list'
import styles from './styles.scss'

class ContactList extends React.Component {
  static propTypes = {
    selectContact: PropTypes.func.isRequired,
    order: PropTypes.object,
    client: PropTypes.object
  }

  deleteContact = ({ mutate }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteContact: {
        ...variables,
        __typename: 'Contact'
      }
    },
    update: (store, { data: { deleteContact } }) => {
      let data = store.readQuery({
        query: CONTACTS_QUERY
      })
      let { contacts } = data
      contacts = contacts.filter(contact => contact.id !== deleteContact.id)
      data = { ...data, contacts }
      store.writeQuery({ query: CONTACTS_QUERY, data })
    }
  })

  render () {
    const {
      classes,
      order,
      ...rest
    } = this.props

    return (
      <Query query={CONTACTS_QUERY}>
        {contacts => {
          if (contacts.loading) {
            return false
          }
          return (
            <Mutation mutation={DELETE_CONTACT}>
              {(mutate, { error, data, loading }) => (
                <List
                  className={styles.list}
                  dataSource={contacts.data.contacts}
                  renderItem={(contact) => (
                    <ContactListItem
                      contact={contact}
                      checked={order?.data?.currentOrder?.contact?.id === contact.id}
                      key={contact.id}
                      deleteContact={this.deleteContact({ mutate })}
                      selectContact={this.props.selectContact}
                    />
                  )}
                />
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default ContactList
