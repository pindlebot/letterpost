import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const stylesheet = {
  root: {
    backgroundImage: 'linear-gradient(-180deg, #34d058 0%, #28a745 90%)',
    borderRadius: '4px',
    border: 0,
    color: 'white',
    height: 38,
    padding: '0 20px',
    fontWeight: 700,
    maxWidth: '200px'
  }
}

function createStyles (props) {
  switch (props.flavor) {
    case 'green':
    case 'black':
    case 'active':
      return {
        ...props.style
      }

    case 'disabled':
      return {
        color: '#24292e',
        background: '#fafafa',
        ...props.style
      }
    case 'blue':
      return {
        backgroundColor: 'rgba(15, 32, 46, 0.9)',
        backgroundImage: 'none',
        color: 'rgba(255,255,255,0.9)',
        '&:hover': {
          backgroundColor: 'rgba(15, 32, 46, 1)',
          color: '#fff'
        },
        ...props.style
      }
    default:
      return {
        border: '1px solid rgba(27,31,35,0.2)',
        backgroundImage: 'none',
        color: '#24292e',
        ...props.style
      }
  }
}

function FancyButton (props) {
  const { flavor, ...other } = props
  const styles = createStyles(props)
  return (
    <Button className={props.classes.root} {...other} style={styles}>
      {props.children}
    </Button>
  )
}

FancyButton.propTypes = {
  flavor: PropTypes.string,
  classes: PropTypes.object.isRequired
}

FancyButton.defaultProps = {
  flavor: null
}

export default withStyles(stylesheet)(FancyButton)
