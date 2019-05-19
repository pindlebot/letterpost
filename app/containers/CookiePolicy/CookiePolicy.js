import React from 'react'
import Layout from 'Layout'
import cookiePolicy from '../../static/cookie-policy.md'
import 'isomorphic-fetch'
import marked from 'marked'

class CookiePolicy extends React.Component {
  state = {
    html: ''
  }

  async componentDidMount () {
    let markdown = await fetch(cookiePolicy)
      .then(resp => resp.text())
    let html = marked(markdown)
    this.setState({ html }, () => {
      this.props.setLoadingState(false)
    })
  }

  render () {
    return (
      <Layout {...this.props}>
        <div
          style={{
            maxWidth: '720px',
            boxSizing: 'border-box',
            margin: '1em auto',
            backgroundColor: '#fff',
            borderRadius: '4px',
            padding: '30px'
          }}
          dangerouslySetInnerHTML={{ __html: this.state.html }}
        />
      </Layout>
    )
  }
}

export default CookiePolicy
