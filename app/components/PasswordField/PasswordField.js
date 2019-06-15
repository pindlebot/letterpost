import React from 'react'
import PropTypes from 'prop-types'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import classes from './styles.scss'

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
    const { value, onChange } = this.props
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

export default PasswordField
