import React from 'react'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import stylesheet from './styles.scss'

const OrdersToolbar = (props) => {
  const {
    handleDelete,
    open,
    classes
  } = props

  return (
    <Toolbar className={classes.flex}>
      <h2
        className={classes.title}
      >
        Orders
      </h2>
      <div className={classes.spacer} />
      <IconButton
        onClick={() => {}}
        disabled={!open}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={handleDelete}
        disabled={!open}
      >
        <DeleteIcon />
      </IconButton>
    </Toolbar>
  )
}

OrdersToolbar.propTypes = {
  classes: PropTypes.object,
  handleDelete: PropTypes.func,
  open: PropTypes.bool
}

export default OrdersToolbar
