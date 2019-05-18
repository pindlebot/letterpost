import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const UPDATE_PASSWORD = gql`
  mutation ($password: String!) {
    updatePassword(password: $password) {
      id
    }
  }
`

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap'
  },
  formControl: {},
  withoutLabel: {}
})

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
      <InputAdornment position='end'>
        <IconButton
          aria-label={'Edit'}
          onClick={this.toggleEdit(mutate)}
          onMouseDown={evt => {
            evt.preventDefault()
          }}
        >
          {this.props.loading || loading
            ? <CircularProgress />
            : this.state.disabled
              ? <EditIcon />
              : <SaveIcon />
          }
        </IconButton>
      </InputAdornment>
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
    const { classes } = this.props
    const { showPassword } = this.state

    return (
      <Mutation mutation={UPDATE_PASSWORD}>
        {(mutate, { loading, error }) => {
          return (
            <div className={classes.root} onClick={this.handleClick}>
              <FormControl fullWidth>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={this.state.password}
                  onChange={this.handleChange}
                  disableUnderline
                  placeholder='Password'
                  autoComplete={'current-password'}
                  endAdornment={this.renderAdornment(mutate, { loading })}
                  disabled={this.state.disabled}
                  inputRef={ref => {
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
              </FormControl>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

EditPasswordTextField.propTypes = {
  classes: PropTypes.object.isRequired
}

EditPasswordTextField.defaultProps = {
  fullWidth: true,
  type: 'password',
  id: 'password',
  placeholder: 'Password',
  margin: 'normal',
  InputProps: {
    disableUnderline: true
  }
}

export default withStyles(styles)(EditPasswordTextField)
