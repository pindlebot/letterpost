import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  button: {
    backgroundImage: '#A1C4FD',
    color: '#fff',
    maxWidth: '160px',
    border: 'none'
  }
}

export default withStyles(styles)(
  ({ classes, ...rest }) => <Button {...rest} className={classes.button} />
)
