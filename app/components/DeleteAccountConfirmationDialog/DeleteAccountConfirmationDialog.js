import React from 'react'

import { Mutation } from 'react-apollo'
import { DELETE_USER } from '../../graphql/mutations'

import Popconfirm from 'antd/lib/popconfirm'
import Button from 'antd/lib/button'

class DeleteAccountConfirmationDialog extends React.Component {
  deleteAccount = mutate => async evt => {
    await mutate({
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
            <Popconfirm
              title='Are you sure delete your account?'
              onConfirm={this.deleteAccount(mutate)}
              onCancel={this.props.handleClose}
              okText='Yes'
              cancelText='No'
            >
              <Button
                disabled={this.props.user.role !== 'USER'}
              >
                Delete Account
              </Button>
            </Popconfirm>
          )
        }}
      </Mutation>
    )
  }
}

export default DeleteAccountConfirmationDialog
