import React from 'react'
import Layout from '../../components/Layout'
import terms from '../../static/terms.md'
import 'isomorphic-fetch'
import marked from 'marked'
import { withStyles } from '@material-ui/core/styles'

class Terms extends React.Component {
  state = {
    html: ''
  }
  async componentDidMount () {
    let markdown = await fetch(terms).then(resp => resp.text())
    let html = marked(markdown)
    this.setState({ html }, () => {
      this.props.setLoadingState(false)
    })
  }

  render () {
    const { classes, ...rest } = this.props
    return (
      <Layout {...rest}>
        <div
          className={classes.main}
          dangerouslySetInnerHTML={{ __html: this.state.html }}
        />
      </Layout>
    )
  }
}

export default withStyles(
  theme => ({
    main: {
      maxWidth: '720px',
      boxSizing: 'border-box',
      margin: '1em auto',
      backgroundColor: '#fff',
      borderRadius: '4px',
      padding: '30px'
    }
  })
)(Terms)
