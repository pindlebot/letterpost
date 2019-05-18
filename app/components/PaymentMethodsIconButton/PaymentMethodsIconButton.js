import React from 'react'
import Spinner from '../Spinner'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    // backgroundColor: 'rgba(27,31,35,0.08)',
    // color: '#444d56',
    // width: '40px',
    // height: '40px',
  }
}

function PaymentMethodsIconButton (props) {
  const {
    loading,
    deletePrimaryCard,
    primaryCard,
    classes,
    disabled
  } = props

  if (!primaryCard) {
    return false
  }

  if (loading) {
    return (
      <IconButton className={classes.root}>
        <Spinner fullPage={false} />
      </IconButton>
    )
  }

  return (
    <IconButton onClick={deletePrimaryCard} className={classes.root} disabled={disabled}>
      <DeleteIcon />
    </IconButton>
  )
}

PaymentMethodsIconButton.defaultProps = {
  loading: false,
  disabled: false
}
export default withStyles(styles)(PaymentMethodsIconButton)
