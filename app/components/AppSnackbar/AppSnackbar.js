import React from 'react'
import { connect } from 'react-redux'
import notification from 'antd/lib/notification'

class ValidationErrorsSnackbar extends React.Component {
  componentDidUpdate (prevProps) {
    const { validationErrors } = this.props
    const keys = Object.keys(validationErrors)
    if (keys.length !== Object.keys(prevProps.validationErrors).length) {
      keys.forEach(key => {
        notification.open({
          message: validationErrors[key].message,
          description: ''
        })
      })
    }
  }
  render () {
    return null
  }
}

export default connect(
  state => state,
  dispatch => ({
    handleClose: () => dispatch({ type: 'CLEAR_SNACKBAR' })
  })
)(ValidationErrorsSnackbar)
