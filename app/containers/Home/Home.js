import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose } from 'react-apollo'
import Layout from '../../components/Layout'
import Hero from '../../components/Hero'
import { withRouter } from 'react-router-dom'

class Index extends React.Component {
  static propTypes = {
  }

  componentDidMount () {
    this.props.setLoadingState(false)
  }
  render () {
    return (
      <Layout {...this.props} landing>
        <Hero {...this.props} />
      </Layout>
    )
  }
}

export default compose(
  withRouter,
  withApollo
)(Index)
