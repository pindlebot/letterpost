import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import IconButton from '@material-ui/core/IconButton'
// import Input from '@material-ui/core/Input'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import FormControl from '@material-ui/core/FormControl'
// ort Visibility from '@material-ui/icons/Visibility'
// import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {},
  withoutLabel: {}
})

class PasswordField extends React.Component {
  state = {
    password: '',
    showPassword: false
  };

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value })
  }

  handleMouseDown = (event) => {
    event.preventDefault()
  }

  reaveal = () => {
    this.setState(prevState =>
      ({ showPassword: !prevState.showPassword })
    )
  }

  render () {
    const { classes, value, onChange } = this.props
    const { showPassword } = this.state
    return (
      <div className={classes.root}>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder='Password'
          addonAfter={
            <div>
              <Button
                shape={'circle'}
                icon={'edit'}
                onClick={this.reaveal}
                onMouseDown={this.handleMouseDown}
              />
            </div>
          }
        />
      </div>
    )
  }
}

PasswordField.propTypes = {
  classes: PropTypes.object.isRequired
}

PasswordField.defaultProps = {
  fullWidth: true,
  type: 'password',
  id: 'password',
  placeholder: 'Password',
  margin: 'normal',
  InputProps: {
    disableUnderline: true
  }
}

export default withStyles(styles)(PasswordField)
