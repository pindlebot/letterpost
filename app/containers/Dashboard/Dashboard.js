import React from 'react'
import Layout from '../../components/Layout'
import { withStyles } from '@material-ui/core/styles'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import DashboardMessagesTable from '../../components/DashboardMessagesTable'
import DashboardMessage from '../../components/DashboardMessage'
import { USER_QUERY, MESSAGE_QUERY, MESSAGES_QUERY } from '../../graphql/queries'
import { DELETE_MESSAGE } from '../../graphql/mutations'

import ReplyDialog from '../../components/ReplyDialog'

class Dashboard extends React.Component {
  state = {
    dialog: undefined,
    selected: []
  }

  componentDidMount () {
    this.props.setLoadingState(false)
  }

  handleReplyClick = () => {
    this.setState({ dialog: 'REPLY' })
  }

  handleDialogClose = () => {
    this.setState({ dialog: undefined })
  }

  handleDeleteMessage = async () => {
    const { selected } = this.state
    let promises = Promise.all(
      selected.map(id => this.props.deleteMessage({
        variables: { id },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteMessage: {
            __typename: 'Message',
            id: id
          }
        }
      }))
    )

    await promises
  }

  render () {
    const { classes, query, user, ...other } = this.props
    const { match: { params }, client } = this.props
    const { dialog } = this.state
    return (
      <Layout {...other}>
        <ReplyDialog
          dialog={dialog}
          handleClose={this.handleDialogClose}
          message={query.data.message}
          user={user.data.user}
        />
        <div className={classes.main}>
          {params.id
            ? <DashboardMessage
              {...this.props}
              message={query.data.message}
              user={user.data.user}
              handleDialogClose={this.handleDialogClose}
              handleReplyClick={this.handleReplyClick}
              dialog={dialog}
              deleteMessage={this.props.deleteMessage}
            />
            : <DashboardMessagesTable
              data={query.data.messages}
              client={client}
              handleDialogClose={this.handleDialogClose}
              handleReplyClick={this.handleReplyClick}
              dialog={dialog}
              deleteMessage={this.props.deleteMessage}
            />
          }
        </div>
      </Layout>
    )
  }
}

const styles = {
  main: {
    maxWidth: '960px',
    boxSizing: 'border-box',
    margin: '1em auto'
  }
}

export default withStyles(styles)(props => (
  <Query query={USER_QUERY}>
    {user => {
      if (user.loading) return false
      const { data } = user
      if (!data.user.emailAddress.endsWith('@letterpost.co')) {
        return false
      }
      return (
        <Query query={props.match.params.id ? MESSAGE_QUERY : MESSAGES_QUERY} variables={props.match.params}>
          {query => {
            if (query.loading) return false
            return (
              <Mutation mutation={DELETE_MESSAGE}>
                {deleteMessage => {
                  return (
                    <Dashboard
                      {...props}
                      query={query}
                      user={user}
                      deleteMessage={deleteMessage}
                    />
                  )
                }}
              </Mutation>
            )
          }}
        </Query>
      )
    }}
  </Query>
))
