import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  avatar: {
    background: 'linear-gradient(120deg, #ffd54f 0%, #ffb74d 100%)',
    backgroundColor: '#28a745',
    marginRight: 12
  },
  inline: {
    display: 'inline-flex',
    alignItems: 'center'
  }
}

const OrderStepHeading = withStyles(styles)(({ step, label, classes }) => (
  <div className={classes.inline}>
    <Avatar className={classes.avatar}>{step}</Avatar>
    <Typography variant={'body2'}>{label}</Typography>
  </div>
))

export default OrderStepHeading
