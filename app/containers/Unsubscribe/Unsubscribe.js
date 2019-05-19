import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import Layout from 'Layout'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/core/styles'

const USER_QUERY = gql`
  query {
    user {
      id
    }
  }
`

const UPDATE_USER = gql`
  mutation ($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      subscribed
    }
  }
`

class Unsubscribe extends React.Component {
  static propTypes = {}

  async componentDidMount () {
    let {
      user: {
        data: {
          user
        }
      }
    } = this.props
    this.props.unsubscribe({
      variables: {
        input: {
          id: user.id,
          subscribed: false
        }
      }
    }).then(() => {
      this.props.setLoadingState(false)
    })
  }

  render () {
    const { classes, ...rest } = this.props
    return (

      <Layout {...this.props}>
        <div className={classes.main}>
          You've been unsubscribed from all communications!
        </div>
      </Layout>
    )
  }
}

const styles = theme => ({
  main: {
    maxWidth: '720px',
    boxSizing: 'border-box',
    margin: '1em auto',
    backgroundColor: '#fff',
    borderRadius: '4px',
    padding: '30px'
  }
})

export default compose(
  withRouter,
  withApollo,
  withStyles(styles)
)(props => {
  return (
    <Query query={USER_QUERY}>
      {user => {
        if (user.loading) return false
        return (
          <Mutation mutation={UPDATE_USER}>
            {mutate => {
              return (
                <Unsubscribe {...props} unsubscribe={mutate} user={user} />
              )
            }}
          </Mutation>
        )
      }}
    </Query>
  )
})
