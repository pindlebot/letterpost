import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { connect } from 'react-redux'

class ValidationErrorsSnackbar extends React.Component {
  render () {
    const { snackbar, validationErrors } = this.props.root
    const keys = Object.keys(validationErrors)
    return keys.map(key => (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={Boolean(snackbar?.show)}
        autoHideDuration={6000}
        onClose={this.props.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        key={key}
        message={<span id='message-id'>{validationErrors[key].message}</span>}
      />
    ))
  }
}

export default connect(
  state => state,
  dispatch => ({
    handleClose: () => dispatch({ type: 'CLEAR_SNACKBAR' })
  })
)(ValidationErrorsSnackbar)
