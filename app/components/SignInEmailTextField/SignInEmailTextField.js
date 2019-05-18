import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

const SignInEmailTextField = props => (
  <TextField
    className={props.classes.input}
    id='email'
    placeholder='Email'
    margin='normal'
    InputProps={{
      disableUnderline: true
    }}
    value={props.value}
    onChange={props.onChange}
    type={'email'}
    autoComplete={'username'}
  />
)

export default withStyles({
  input: {
    width: '100%'
  }
})(SignInEmailTextField)
