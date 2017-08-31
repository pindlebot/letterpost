import React from 'react'
import cookie from 'cookie'
import { withApollo, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Button from 'material-ui/Button'

import withData from '../lib/with-data'
import redirect from '../lib/redirect'
import checkLoggedIn from '../lib/check-logged-in'
import PdfDropzone from '../components/PdfDropzone'
import Layout from '../components/Layout'


class Index extends React.Component {
  static async getInitialProps (context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient)

    if (!loggedInUser.user) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/signin')
    }

    return { loggedInUser }
  }

  constructor(props) {
    super(props)

    this.state = {
      socket: null,
      details: null
    }
  }

  signout = () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1 // Expire the cookie immediately
    })

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    this.props.client.resetStore().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/signin')
    })
  }

  componentDidMount() {
    var socket = new WebSocket('ws://localhost:3000')
    socket.binaryType = 'arraybuffer';
    socket.onmessage = (event) => {
      this.setState({details: JSON.parse(event.data)})
    }
    this.setState({socket})
  }

  render () {
    return (
      <Layout>
      <div>
        Hello {this.props.loggedInUser.user.name}!<br />

        <Button 
          color="primary" 
          onClick={this.signout}>
          Sign out
        </Button>
        <PdfDropzone 
          socket={this.state.socket}
          details={this.state.details}
        />
        <Button 
          color="primary" 
          onClick={() => {
          var {loggedInUser: { user: { id } } } = this.props
          var url = this.state.details.Location;
          this.props.addPdfLink({id, url})
        }}
        >AddPdfLink</Button>
      </div>
      </Layout>
    )
  }
};

export default compose(
  // withData gives us server-side graphql queries before rendering
  withData,
  // withApollo exposes `this.props.client` used when logging out
  withApollo,
  graphql(gql`
    mutation updateUser(
      $id: ID!,
      $url: String!
    ) {
      updateUser(
        id: $id,
        url: $url
      ) {
        id
        url
      }
    }
  `, { 
    props: ({ mutate }) => ({
      addPdfLink: ({id, url}) => mutate({variables: {id, url} }) 
    })
  })
)(Index)
