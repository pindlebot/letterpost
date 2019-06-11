import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Input from 'antd/lib/input'
import Icon from 'antd/lib/icon'

const UPDATE_PASSWORD = gql`
  mutation ($password: String!) {
    updatePassword(password: $password) {
      id
    }
  }
`

class EditPasswordTextField extends React.Component {
  state = {
    showPassword: false,
    password: '',
    disabled: true
  }

  toggleEdit = mutate => async (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    const { user: { data: { user } } } = this.props
    const { disabled, password } = this.state
    if (!disabled) {
      await mutate({
        variables: {
          password: password
        }
      }).then(() => {
        window.localStorage.removeItem('token')
        this.props.signin()
      }).catch(err => {
        this.props.setGraphQLErrors({
          EditPasswordTextField: {
            message: err.graphQLErrors
          }
        })
      })
    }
  }

  handleChange = (event) => {
    this.setState({ password: event.target.value })
  }

  handleMouseDown = (event) => {
    event.preventDefault()
  }

  reaveal = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }))
  }

  renderAdornment (mutate, { loading }) {
    const { password } = this.state
    return (
      <Icon
        type={
          this.props.loading || loading
            ? 'loading'
            : this.state.disabled
              ? 'edit'
              : 'save'
        }
        onClick={this.toggleEdit(mutate)}
        onMouseDown={evt => {
          evt.preventDefault()
        }}
      />
    )
  }

  handleClick = (evt) => {
    this.setState(prevState => {
      if (!prevState.disabled) {
        return null
      }
      return { disabled: false }
    }, () => {
      this.ref.focus()
    })
  }

  render () {
    const { showPassword } = this.state

    return (
      <Mutation mutation={UPDATE_PASSWORD}>
        {(mutate, { loading, error }) => {
          return (
            <div onClick={this.handleClick}>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange}
                placeholder='Password'
                autoComplete={'current-password'}
                suffix={this.renderAdornment(mutate, { loading })}
                disabled={this.state.disabled}
                ref={ref => {
                  this.ref = ref
                }}
              />
              {this.state.disabled && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }} />
              )}
            </div>
          )
        }}
      </Mutation>
    )
  }
}

EditPasswordTextField.defaultProps = {
  fullWidth: true,
  type: 'password',
  id: 'password',
  placeholder: 'Password',
  margin: 'normal'
}

export default EditPasswordTextField
