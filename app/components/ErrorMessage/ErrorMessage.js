import React from 'react'
import Paper from '@material-ui/core/Paper'
import ErrorIcon from '@material-ui/icons/Error'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

const styles = {
  container: {
    padding: '20px',
    borderRadius: '4px',
    backgroundColor: '#d73a49',
    color: '#fff',
    maxWidth: '600px',
    minWidth: '400px',
    margin: '0 auto 0 auto'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  type: {
    color: '#fff'
  },
  icon: {
    color: '#fff'
  }
}

const ErrorMessage = props => {
  if (!(props.error && props.error.message)) return false
  if (!props.show) return false
  return (
    <Paper elevation={0} className={props.classes.container}>
      <div className={props.classes.row}>
        <ErrorIcon />
        <Typography className={props.classes.type}>
          {props.error.message}
        </Typography>
        <IconButton onClick={props.handleClose}>
          <DeleteIcon className={props.classes.icon} />
        </IconButton>
      </div>
    </Paper>
  )
}

ErrorMessage.defaultProps = {
  show: true,
  error: {}
}

export default withStyles(styles)(ErrorMessage)
