import React from 'react'
import PropTypes from 'prop-types'

import List from 'antd/lib/list'
import Checkbox from 'antd/lib/checkbox'
import Button from 'antd/lib/button'
import styles from './styles.scss'

const ContactListItem = props => {
  const {
    selectContact,
    deleteContact,
    contact,
    checked
  } = props
  const { address } = contact
  return (
    <List.Item
      button
      onClick={e => selectContact(contact)}
      className={styles.root}
    >
      <Checkbox
        checked={checked}
        tabIndex={-1}
        disableRipple
      />
      {address.name}
      <Button
        aria-label='Delete'
        onClick={(e) => {
          deleteContact({ id: contact.id })
        }}
        shape={'circle'}
        icon={'delete'}
      />
    </List.Item>
  )
}

// ContactListItem.propTypes = {
//  contact: PropTypes.object.isRequired,
//  handleToggle: PropTypes.func.isRequired,
//  deleteContact: PropTypes.func.isRequired,
//  classes: PropTypes.object.isRequired,
//  url: PropTypes.object.isRequired,
//  redirect: PropTypes.func.isRequired
// }

export default ContactListItem
