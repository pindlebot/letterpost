import React from 'react'
import PropTypes from 'prop-types'
import Footer from '../Footer'
import withStyles from '@material-ui/core/styles/withStyles'
import pattern from '../../styles/pattern'

const styles = {
  root: {
    margin: '0 auto',
    height: '100%',
    backgroundColor: '#f5f7f9'
  },
  inner: {
    paddingBottom: '300px',
    backgroundColor: '#f5f7f9',
    backgroundImage: pattern
  }
}

function Background (props) {
  const {
    classes,
    landing,
    hideFooter
  } = props

  const backgroundImage = 'linear-gradient(45deg, #F6C8F6 0%, #DADDFA 48%, #F1F4F9 100%)'
  const innerStyles = landing ? { backgroundImage } : {}

  return (
    <div className={classes.root}>
      <div style={{ minHeight: '100%' }}>
        <div className={classes.inner} style={innerStyles}>
          {props.children}
        </div>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

Background.defaultProps = {
  loading: false,
  landing: false
}

Background.propTypes = {
  loading: PropTypes.bool,
  landing: PropTypes.bool,
  classes: PropTypes.object
}

export default withStyles(styles)(Background)
