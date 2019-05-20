import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import get from 'lodash.get'

const styles = {
  root: {
    backgroundColor: '#f6f8fa',
    color: '#24292e',
    paddingTop: 0,
    paddingBottom: 0
  },
  icon: {
    color: '#586069'
  }
}

const ContactListItem = props => {
  const {
    selectContact,
    deleteContact,
    classes,
    contact,
    checked
  } = props
  const { address } = contact
  return (
    <ListItem
      button
      onClick={e => selectContact(contact)}
      className={classes.root}
    >
      <Checkbox
        checked={checked}
        tabIndex={-1}
        disableRipple
      />
      <ListItemText
        inset
        primary={address.name || ''}
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label='Delete'
          onClick={(e) => {
            deleteContact({ id: contact.id })
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
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

export default withStyles(styles)(ContactListItem)
