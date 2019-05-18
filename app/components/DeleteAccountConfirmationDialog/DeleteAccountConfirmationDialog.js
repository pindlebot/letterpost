import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { Mutation } from 'react-apollo'
import { DELETE_USER } from '../../graphql/mutations'

class DeleteAccountConfirmationDialog extends React.Component {
  deleteAccount = mutate => async evt => {
    let data = await mutate({
      variables: {
        id: this.props.user.id
      }
    }).then(() => {
      window.localStorage.removeItem('token')
      this.props.redirect('/')
    })
  }
  render () {
    return (
      <Mutation mutation={DELETE_USER}>
        {mutate => {
          return (
            <Dialog
              open={this.props.open}
              onClose={this.handleClose}
            >
              <DialogTitle>Delete Account</DialogTitle>
              <DialogActions>
                <Button onClick={this.props.handleClose} color={'primary'} variant={'text'}>
                  Cancel
                </Button>
                <Button onClick={this.deleteAccount(mutate)} color={'primary'} variant={'text'}>
                  Delete Account
                </Button>
              </DialogActions>
            </Dialog>
          )
        }}
      </Mutation>
    )
  }
}

export default DeleteAccountConfirmationDialog
