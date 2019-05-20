import React from 'react'
import ReactDOM from 'react-dom'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

class Overlay extends React.Component {
  constructor (props) {
    super(props)

    this.el = document.createElement('div')
    this.root = document.getElementById('overlay')
  }

  componentDidMount () {
    this.root.appendChild(this.el)
  }

  componentWillUnmount () {
    this.root.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}

const styles = () => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(to bottom, #121212 0%, #323232 100%)'
  },
  container: {
    position: 'absolute',
    top: 'calc(50vh - 13px)',
    left: 'calc(50vw - 50px)',
    opacity: '0.9'
  },
  spinner: {
    width: 100
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
  paused: {
    animationPlayState: 'paused'
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

class LoadingOverlay extends React.Component {
  componentDidMount () {
    console.log('mounting')
  }
  componentWillUnmount () {
    console.log('unmounting')
  }
  render () {
    const { paused, classes } = this.props
    return (
      <Overlay>
        <div className={classes.root} style={{
          opacity: paused ? 0 : 1
        }}>
          <div className={classes.container}>
            <div className={classes.spinner}>
              <div className={classnames(classes.bounce, classes.bounce1, { [classes.paused]: paused })} />
              <div className={classnames(classes.bounce, classes.bounce2, { [classes.paused]: paused })} />
              <div className={classnames(classes.bounce, classes.bounce3, { [classes.paused]: paused })} />
            </div>
          </div>
        </div>
      </Overlay>
    )
  }
}

LoadingOverlay.defaultProps = {
  paused: false
}

export default withStyles(styles)(LoadingOverlay)
