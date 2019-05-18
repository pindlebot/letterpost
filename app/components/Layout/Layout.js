import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Header from '../LayoutHeader'
import getToken from '../../lib/getToken'
import Footer from '../Footer'

const styles = {
  main: {
    backgroundColor: '#fafafa',
    paddingTop: 40,
    minHeight: 'calc(100vh - 245px)',
    height: '100%',
    boxSizing: 'border-box',
    backgroundImage: 'radial-gradient(circle, #D7D7D7, #D7D7D7 1px, #FFF 1px, #FFF)',
    backgroundSize: '28px 28px'
  }
}

class Layout extends Component {
  signout = async () => {
    window.localStorage.removeItem('token')
    getToken(this.props)
      .then(() => {
        this.props.redirect('/login')
      })
  }

  render () {
    const { classes, loading, ...other } = this.props
    const { user } = this.props
    const logged = user?.data?.user?.role === 'USER'
    return (
      <div>
        <Header
          {...other}
          signout={this.signout}
          logged={logged}
        />
        <div className={classes.main}>
          {this.props.children}
        </div>
        <Footer {...other} />
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool
}

Layout.defaultProps = {
  loading: false,
  user: {}
}

export default withStyles(styles)(Layout)
