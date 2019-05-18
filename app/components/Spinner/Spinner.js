import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import classnames from 'classnames'

const styles = () => ({
  // '@global': {
  //  body: {
  //    backgroundColor: '#29b6f6'
  //  }
  // },
  progress: {
    margin: '0 auto 0 auto',
    color: '#8898AA'
  },
  fullPage: {
    position: 'absolute',
    top: 'calc(50vh - 13px)',
    left: 'calc(50vw - 50px)',
    opacity: '0.9 !important'
  },
  icon: {
    margin: '0'
  },
  spinner: {
    width: 100,
    textAlign: 'center'
  },
  bounce: {
    width: 20,
    height: 20,
    backgroundColor: '#29b6f6',
    borderRadius: '100%',
    display: 'inline-block',
    animation: 'sk-bouncedelay 1.4s infinite ease-in-out both',
    marginRight: 10
  },
  '@keyframes sk-bouncedelay': {
    '0%, 80%, 100%': {
      transform: 'scale(0)'
    },
    '40%': {
      transform: 'scale(1.0)'
    }
  },
  bounce1: {
    animationDelay: '-0.32s'
  },
  bounce2: {
    animationDelay: '-0.16s'
  },
  bounce3: {}
})

const Spinner = props => {
  const {
    classes,
    fullPage
  } = props
  const className = fullPage ? classes.fullPage : classes.icon
  return (
    <div className={className}>
      <div className={classes.spinner}>
        <div className={classnames(classes.bounce, classes.bounce1)} />
        <div className={classnames(classes.bounce, classes.bounce2)} />
        <div className={classnames(classes.bounce, classes.bounce3)} />
      </div>
    </div>
  )
}

Spinner.propTypes = {
  classes: PropTypes.object.isRequired,
  fullPage: PropTypes.bool
}

Spinner.defaultProps = {
  fullPage: true
}

export default withStyles(styles)(Spinner)
