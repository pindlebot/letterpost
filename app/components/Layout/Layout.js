import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Header from '../LayoutHeader'
import getToken from '../../lib/getToken'
import Footer from '../Footer'
import AntLayout from 'antd/lib/layout'
import styles from './styles.scss'


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
      <AntLayout>
        <Header
          {...other}
          signout={this.signout}
          logged={logged}
        />
        <AntLayout.Content className={styles.root} style={{ padding: '24px 50px' }}>
          {this.props.children}
        </AntLayout.Content>
        <Footer {...other} />
      </AntLayout>
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
