import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

const stylesheet = {
  flex: {},
  right: {},
  spacer: {
    flex: '1 1 100%'
  },
  title: {
    flex: '0 0 auto'
  }
}

const OrdersToolbar = (props) => {
  const {
    handleDelete,
    open,
    classes
  } = props

  return (
    <Toolbar className={classes.flex}>
      <Typography
        variant='h2'
        gutterBottom
        className={classes.title}
      >
        Orders
      </Typography>
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

export default withStyles(stylesheet)(OrdersToolbar)
