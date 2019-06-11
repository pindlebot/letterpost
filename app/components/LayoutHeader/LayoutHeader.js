/* eslint-disable react/no-danger */
import React from 'react'
import LayoutHeaderMenu from '../LayoutHeaderMenu'
import config from '../../lib/config'
import Button from 'antd/lib/button'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Layout from 'antd/lib/layout'
import styles from './styles.scss'
import Toolbar from 'Toolbar'

const LandingPageMenu = props => {
  const { logged } = props
  if (logged) {
    return (
      <Button
        style={{ marginRight: '20px' }}
        onClick={props.order}
        className={styles.button}
      >
        Order
      </Button>
    )
  }
  return (
    <div>
      <Button
        style={{ marginRight: '20px' }}
        onClick={props.login}
        className={styles.button}
      >
        Login
      </Button>
      <Button
        onClick={props.login}
        className={styles.button}
      >
        Create Account
      </Button>
    </div>
  )
}

LandingPageMenu.defaultProps = {
  logged: false
}

const LayoutHeader = props => {
  const { classes, ...other } = props

  return (
    <Layout.Header style={{ zIndex: 1, width: '100%' }} className={styles.header}>
      <Toolbar>
        <Button
          className={styles.button}
          onClick={() => {}}
          color='inherit'
          aria-label='Menu'
          shape={'circle'}
          icon={'mail'}
        />
        <div className={styles.brand}>
          <a href='/' className={styles.link}>
            {config.APP_NAME}
          </a>
        </div>
        {props.landing
          ? <LandingPageMenu {...other} />
          : <LayoutHeaderMenu {...other} />}
      </Toolbar>
    </Layout.Header>
  )
}

export default compose(
  connect(
    state => state,
    dispatch => ({
      login: () => dispatch(push('/login')),
      order: () => dispatch(push('/order')),
      account: () => dispatch(push('/account'))
    })
  ),
)(LayoutHeader)
