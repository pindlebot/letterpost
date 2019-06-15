import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import Layout from 'Layout'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import EditEmailTextField from 'EditEmailTextField'
import { ORDERS_QUERY, USER_QUERY } from '../../graphql/queries'
import { UPDATE_USER } from '../../graphql/mutations'
import OrderCard from 'OrderCard'
import EditPasswordTextField from 'EditPasswordTextField'
import { connect } from 'react-redux'
import { setGraphQLErrors } from '../../lib/redux'
import { push } from 'connected-react-router'
import DeleteAccountConfirmationDialog from 'DeleteAccountConfirmationDialog'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import classes from './styles.scss'

class Account extends React.Component {
  static propTypes = {
    data: PropTypes.object
  }

  state = {
    dialog: null
  }

  updateUser = mutate => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateUser: {
        ...variables.input,
        __typename: 'User'
      }
    }
  }).catch(err => this.props.setGraphQLErrors(err.graphQLErrors))

  componentDidMount () {
    this.props.setLoadingState(false)
  }

  handleDialogClose = () => {
    this.setState({ dialog: null })
  }

  render () {
    const { ...other } = this.props
    const {
      user: {
        data: {
          user
        }
      }
    } = this.props
    return (
      <Mutation mutation={UPDATE_USER}>
        {(mutate, { error, data, loading }) => {
          return (
            <Query query={ORDERS_QUERY}>
              {(orders) => {
                if (orders.loading) return false
                return (
                  <Layout {...other}>
                    <div className={classes.main}>
                      <Row
                        className={classes.grid}
                        type={'flex'}
                      >
                        <Col
                          className={classes.left}
                          span={8}
                        >
                          <div className={classes.h1}>
                            Account
                          </div>
                        </Col>
                        <Col
                          className={classes.right}
                          span={16}
                        >
                          <Row gutter={12} type={'flex'}>
                            <Col span={12}>
                              <EditEmailTextField
                                user={this.props.user}
                                client={this.props.client}
                                updateUser={this.updateUser(mutate)}
                                loading={loading}
                                setGraphQLErrors={this.props.setGraphQLErrors}
                              />
                            </Col>
                            <Col span={12}>
                              <EditPasswordTextField
                                user={this.props.user}
                                client={this.props.client}
                                updateUser={this.updateUser(mutate)}
                                loading={loading}
                                setGraphQLErrors={this.props.setGraphQLErrors}
                                clearGraphQLErrors={this.props.clearGraphQLErrors}
                                graphQLErrors={this.props.root.graphQLErrors}
                                signin={this.props.signin}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row
                        className={classes.grid}
                        type={'flex'}
                      >
                        <Col
                          span={6}
                          className={classes.left}
                        >
                          <div className={classes.h4}>
                            Danger Zone
                          </div>
                        </Col>
                        <Col
                          span={18}
                          className={classes.right}
                        >
                          <Row justify={'end'} type={'flex'}>
                            <DeleteAccountConfirmationDialog
                              handleClose={this.handleDialogClose}
                              open={this.state.dialog === 'DELETE_ACCOUNT'}
                              user={user}
                            />
                            
                          </Row>
                        </Col>
                      </Row>
                      {orders.data.orders.map(order =>
                        <OrderCard order={order} key={order.id} />
                      )}
                    </div>
                  </Layout>
                )
              }}
            </Query>
          )
        }}
      </Mutation>
    )
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(
    state => state,
    dispatch => ({
      setGraphQLErrors: error => dispatch(setGraphQLErrors(error)),
      clearGraphQLErrors: () => dispatch({ type: 'CLEAR_GRAPHQL_ERRORS' }),
      signin: () => dispatch(push('/login'))
    })
  )
)(props => (
  <Query query={USER_QUERY}>
    {user => {
      if (user.loading) return false
      return (
        <Account {...props} user={user} />
      )
    }}
  </Query>
))
