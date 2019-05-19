import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import Layout from 'Layout'
import {
  UPDATE_ORDER,
  CREATE_LETTER,
  CREATE_CHARGE,
  UPDATE_USER
} from '../../graphql/mutations'
import 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'
import styles from './styles'
import { ORDER_QUERY, USER_QUERY } from '../../graphql/queries'
import OrderDialogs from 'OrderDialogs'
import EditEmailTextField from 'EditEmailTextField'
import { OrderPropType, UserPropType } from '../../lib/propTypes'
import OrderGrid from 'OrderGrid'

class EditEmailTextFieldWithMutations extends React.Component {
  updateUser = mutate => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateUser: {
        ...variables.input,
        __typename: 'User'
      }
    }
  })

  render () {
    return (
      <Mutation mutation={UPDATE_USER}>
        {(mutate, { error, data, loading }) => (
          <EditEmailTextField
            {...this.props}
            updateUser={this.updateUser(mutate)}
          />)
        }
      </Mutation>
    )
  }
}

class Order extends React.Component {
  static propTypes = {
    createCharge: PropTypes.func,
    order: OrderPropType,
    user: UserPropType,
    updateOrder: PropTypes.func,
    createLetter: PropTypes.func,
    pending: PropTypes.bool,
    complete: PropTypes.bool
  }

  state = {
    open: undefined,
    error: {},
    accept: false
  }

  componentDidMount () {
    this.props.setLoadingState(false)
  }

  validate = () => {
    const {
      order: {
        data: {
          currentOrder
        }
      },
      user: {
        data: {
          user
        }
      }
    } = this.props
    const error = {}

    if (!currentOrder.contact) {
      error.contact = {}
    }

    if (
      !currentOrder.upload ||
      currentOrder.upload.status !== 'DONE'
    ) {
      error.upload = {}
    }

    if (!user.primaryCard) {
      error.card = {}
    }

    if (!this.state.accept) {
      error.terms = {}
    }

    const keys = Object.keys(error)
    if (
      keys.length ||
      Object.keys(this.state.error).length
    ) {
      this.setState({ error })
    }
    return keys.length < 1
  }

  preSubmit = () => {
    if (this.validate()) {
      this.setState({ open: 'pdf' })
    }
  }

  submitOrder = async () => {
    await new Promise((resolve, reject) => this.setState({ open: undefined }, resolve))
    const { order: { data: { currentOrder } } } = this.props

    const createLetterMutation = await this.props.client.mutate({
      mutation: CREATE_LETTER,
      variables: {
        orderId: currentOrder.id
      }
    }).catch(err => {
      throw err
    })

    const { data: { createLetter } } = createLetterMutation
    const createChargeMutation = await this.props.client.mutate({
      mutation: CREATE_CHARGE,
      variables: {
        orderId: currentOrder.id
      }
    })
    const { data: { createCharge } } = createChargeMutation
    this.props.client.writeQuery({
      query: ORDER_QUERY,
      data: {
        currentOrder: {
          ...currentOrder,
          letter: createLetter,
          charge: createCharge,
          paid: true
        }
      }
    })
  }

  zipLookup = async (contact) => {
    const url = `${window.location.origin}/ziplookup/${contact.postalCode}`
    const resp = await fetch(url)
    const json = await resp.json()
    const { city, state } = json
    this.props.updateContact({
      input: {
        ...contact,
        city,
        state
      }
    })
  }

  handleDialogClose = () => new Promise((resolve, reject) =>
    this.setState({ open: undefined }, resolve))

  render () {
    const { classes, ...other } = this.props
    const {
      order,
      pending,
      complete
    } = this.props
    const currentOrder = order?.data?.currentOrder
    const user = this.props.user?.data?.user
    let { error } = this.state
    let upload = currentOrder?.upload
    let contact = currentOrder?.contact
    let letter = currentOrder?.letter
    return (
      <Layout {...other}>
        <OrderDialogs
          open={this.state.open}
          handleDialogClose={this.handleDialogClose}
          updateOrder={this.props.updateOrder}
          submitOrder={this.submitOrder}
          user={this.props.user}
          order={this.props.order}
          client={this.props.client}
        />
        <div className={classes.main}>
          <OrderGrid
            {...this.props}
            handleOpen={open => {
              this.setState({ open, error: {} })
            }}
            preSubmit={this.preSubmit}
            error={this.state.error}
            accept={this.state.accept}
            onCheckboxChange={evt => {
              this.setState(prevState => ({
                accept: !prevState.accept
              }))
            }}
          />
        </div>
      </Layout>
    )
  }
}

const createMutation = (mutate) => variables => mutate({ variables })

class OrderMutations extends React.Component {
  render () {
    let { params } = this.props.match
    return (
      <Query query={USER_QUERY}>
        {(user) => {
          if (user.error) {
            window.localStorage.removeItem('token')
            this.props.history.push('/')
          }
          return (
            <Query query={ORDER_QUERY} variables={params}>
              {(order) => {
                if (order.error) {
                  return (
                    <div>
                      {order.error.message}
                    </div>
                  )
                }
                return (
                  <Mutation mutation={CREATE_CHARGE}>
                    {(createCharge, { loading: chargeLoading }) => (
                      <Mutation mutation={UPDATE_ORDER}>
                        {updateOrder => (
                          <Mutation mutation={CREATE_LETTER}>
                            {(createLetter, { loading: letterLoading }) => (
                              <Order
                                {...this.props}
                                order={order}
                                user={user}
                                createCharge={createMutation(createCharge)}
                                updateOrder={createMutation(updateOrder)}
                                createLetter={createLetter}
                                pending={letterLoading || chargeLoading}
                                complete={order?.data?.currentOrder?.paid && order?.data?.currentOrder?.letter}
                              />
                            )}
                          </Mutation>
                        )}
                      </Mutation>
                    )}
                  </Mutation>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles)
)(OrderMutations)
