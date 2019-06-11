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
import Button from 'antd/lib/button'
import DeleteAccountConfirmationDialog from 'DeleteAccountConfirmationDialog'
import Col from 'antd/lib/Col'
import Row from 'antd/lib/Row'

const styles = theme => ({
  h1: {
    color: '#fff',
    fontWeight: 700
  },
  main: {
    maxWidth: 720,
    width: '100%',
    margin: '24px auto',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw'
    }
  },
  grid: {
    borderRadius: 3,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    transition: 'box-shadow 150ms ease',
    backgroundColor: '#3C4055',
    backgroundImage: 'linear-gradient(295.7deg, #3B3F55 0.49%, #33334C 95.3%)',
    padding: 30
  },
  left: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      marginBottom: 24
    }
  },
  right: {
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      margin: 0,
      width: '100%'
    }
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 0 32px 0',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 3,
    border: '1px solid #F5F5F5',
    boxSizing: 'border-box'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexBasis: '100%',
    width: '100%'
  },
  'one-third': {
    flexBasis: '33%'
  },
  'two-thirds': {
    flexBasis: '66%'
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    '& > div:first-child': {
      marginRight: 12
    }
  },
  h4: {
    color: '#fff'
  }
})

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
    const { classes, ...other } = this.props
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
  withStyles(styles),
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
