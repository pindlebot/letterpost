import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { connect } from 'react-redux'

class GraphQLErrorsSnackbar extends React.Component {
  render () {
    const { snackbar, graphQLErrors } = this.props.root
    if (!graphQLErrors || !graphQLErrors.length) return false
    return graphQLErrors.map((error, i) => (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={snackbar.show}
        autoHideDuration={6000}
        onClose={this.props.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        key={i}
        message={<span id='message-id'>{error.message}</span>}
      />
    ))
  }
}

export default connect(
  state => state,
  dispatch => ({
    handleClose: () => dispatch({ type: 'CLEAR_SNACKBAR' })
  })
)(GraphQLErrorsSnackbar)
