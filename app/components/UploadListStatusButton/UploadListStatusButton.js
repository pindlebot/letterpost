import React from 'react'
import PropTypes from 'prop-types'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Spinner from '../Spinner'

const styles = {
  root: {
    color: '#757575',
    '&:hover': {
      color: '#616161',
      backgroundColor: 'transparent'
    }
  }
}

function StatusButtonIcon (props) {
  let { status, id } = props
  switch (status) {
    case 'ERROR':
    case 'DONE':
      return <DeleteIcon key={`delete_icon_${id}`} />
    case 'LOADING':
      return <Spinner fullPage={false} />
    default:
      return <DeleteIcon key={`delete_icon_${id}`} />
  }
}

StatusButtonIcon.defaultProps = {
  status: 'LOADING'
}

const StatusButton = props => {
  const {
    classes,
    deleteUpload,
    id
  } = props
  return (
    <IconButton
      key={`icon_button_${id}`}
      aria-label='Delete'
      onClick={() => deleteUpload({ id })}
      className={classes.root}
    >
      <StatusButtonIcon {...props} />
    </IconButton>
  )
}

StatusButton.propTypes = {
  classes: PropTypes.object,
  deleteUpload: PropTypes.func,
  id: PropTypes.string
}

export default withStyles(styles)(StatusButton)
