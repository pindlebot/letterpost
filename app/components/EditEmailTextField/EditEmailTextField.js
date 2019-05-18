import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { EMAIL_IN_USE } from '../../graphql/mutations'
import { compose, Mutation } from 'react-apollo'
import CircularProgress from '@material-ui/core/CircularProgress'
import debounce from 'debounce'
import { connect } from 'react-redux'
import { setValidationError, clearValidationError } from '../../lib/redux'
import isEmail from '../../lib/isEmail'
import ErrorIcon from '@material-ui/icons/Error'
import { push } from 'connected-react-router'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    // margin: theme.spacing.unit
  },
  label: {
    color: '#ddd'
  }
})

class EditEmailTextField extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  static defaultProps = {
    loading: false,
    user: {
      data: {
        user: {
          emailAddress: ''
        }
      }
    }
  }

  state = {
    disabled: true,
    emailAddress: '',
    inUse: true
  }

  componentDidUpdate (prevProps) {
    const emailAddress = this.props?.user?.data?.user?.emailAddress
    if (this.state.emailAddress) return
    if (!emailAddress) return

    this.setState({
      disabled: Boolean(emailAddress),
      emailAddress: emailAddress,
      inUse: true
    })
  }

  debounced = debounce(async (emailAddress, { mutate }) => {
    const { root: { validationErrors } } = this.props
    const hasErrors = validationErrors.hasOwnProperty('EditEmailTextField')
    const isValid = isEmail(emailAddress)

    if (!hasErrors) {
      if (!isValid) {
        this.props.setValidationError({
          EditEmailTextField: {
            message: 'Not a valid email'
          }
        })
      } else {
        let inUse = await mutate({
          variables: {
            emailAddress
          }
        }).then(({ data }) => data.emailInUse)
        if (inUse) {
          this.props.setValidationError({
            EditEmailTextField: {
              message: 'This email address is already in use.'
            }
          })
        }
      }
    }
  }, 500)

  onChange = mutate => ({ currentTarget }) => {
    const { root: { validationErrors } } = this.props
    const hasErrors = validationErrors.hasOwnProperty('EditEmailTextField')
    if (hasErrors) {
      this.props.clearValidationError('EditEmailTextField')
    } else {
      this.debounced(currentTarget.value, { mutate })
    }
    this.setState({ emailAddress: currentTarget.value })
  }

  toggleEdit = ({ mutate }) => async (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    const { user: { data: { user } } } = this.props
    const { disabled, emailAddress } = this.state
    if (emailAddress !== user.emailAddress) {
      if (!isEmail(emailAddress)) {
        this.props.setValidationError({
          EditEmailTextField: {
            message: 'Not a valid email'
          }
        })
        return
      }
      let inUse = false
      if (!disabled) {
        inUse = await mutate({
          variables: {
            emailAddress
          }
        }).then(({ data }) => data.emailInUse)
      }
      if (!inUse) {
        await this.props.updateUser({
          input: {
            id: user.id,
            emailAddress: emailAddress
          }
        })
      }
    }
    await new Promise((resolve, reject) => this.setState({ disabled: !disabled }, resolve))
  }

  renderAdornment (mutate, { loading }) {
    const { emailAddress } = this.state
    const { root: { validationErrors } } = this.props
    const hasErrors = validationErrors.hasOwnProperty('EditEmailTextField')
    if (!emailAddress) return false
    return (
      <InputAdornment position='end'>
        {hasErrors
          ? <IconButton><ErrorIcon /></IconButton>
          : this.props.loading || loading
            ? <CircularProgress />
            : (
              <IconButton
                aria-label={'Edit'}
                onClick={this.toggleEdit({ mutate })}
                onMouseDown={evt => {
                  evt.preventDefault()
                }}
              >{this.state.disabled
                  ? <EditIcon />
                  : <SaveIcon />
                }
              </IconButton>
            )
        }
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
    const { classes, root: { validationErrors } } = this.props
    const { emailAddress } = this.state
    const invalid = validationErrors.hasOwnProperty('EditEmailTextField')
    return (
      <Mutation mutation={EMAIL_IN_USE}>
        {(mutate, { loading, data }) => {
          return (
            <div onClick={this.handleClick} style={{width: '100%'}}>
              <FormControl
                fullWidth
                error={invalid}
              >
                <Input
                  id='adornment-email-address'
                  type={'text'}
                  value={emailAddress}
                  onChange={this.onChange(mutate)}
                  disabled={this.state.disabled}
                  disableUnderline
                  endAdornment={this.renderAdornment(mutate, { loading })}
                  inputRef={ref => {
                    this.ref = ref
                  }}
                  placeholder={'Email address'}
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

export default compose(
  withStyles(styles),
  connect(
    state => state,
    dispatch => ({
      setValidationError: (data) => dispatch(setValidationError(data)),
      clearValidationError: (data) => dispatch(clearValidationError(data))
    })
  )
)(EditEmailTextField)
