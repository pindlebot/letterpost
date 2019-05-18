import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Layout from '../../components/Layout'
import {
  UPDATE_ORDER,
  CREATE_LETTER,
  CREATE_CHARGE,
  UPDATE_USER
} from '../../graphql/mutations'
import 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import PersonIcon from '@material-ui/icons/Person'
import styles from './styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import OrderDetailsOptions from '../../components/OrderDetailsOptions'
import PaymentMethods from '../../components/PaymentMethods'
import AttachmentIcon from '@material-ui/icons/Attachment'
import { ORDER_QUERY, USER_QUERY } from '../../graphql/queries'
import Spinner from '../../components/Spinner'
import OrderCard from '../../components/OrderCard'
import Quote from '../../components/Quote'
import OrderDialogs from '../../components/OrderDialogs'
import OrderStepHeading from '../../components/OrderStepHeading'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import classnames from 'classnames'
import FormHelperText from '@material-ui/core/FormHelperText'
import EditEmailTextField from '../../components/EditEmailTextField'
import { OrderPropType, UserPropType } from '../../lib/propTypes'

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

    let createLetterMutation = await this.props.client.mutate({
      mutation: CREATE_LETTER,
      variables: {
        orderId: currentOrder.id
      }
    }).catch(err => {
      throw err
    })

    let { data: { createLetter } } = createLetterMutation
    let createChargeMutation = await this.props.client.mutate({
      mutation: CREATE_CHARGE,
      variables: {
        orderId: currentOrder.id
      }
    })
    let { data: { createCharge } } = createChargeMutation
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
          <Grid container direction={'column'} spacing={40}>
            <Grid
              container
              item
              direction={'row'}
              className={classnames(classes.grid, error.upload ? classes.error : '')}
            >
              <Grid
                item
                xs={12}
                sm={6}
                className={classes.left}
                container={!upload}
              >
                {upload ? (
                  <List className={classes.half}>
                    <ListItem>
                      <ListItemIcon><AttachmentIcon /></ListItemIcon>
                      <ListItemText
                        inset
                        primary={(upload.name) || ''}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <OrderStepHeading step={1} label={'Add a document'} />
                )}
              </Grid>
              <Grid container item xs={12} sm={6} className={classes.right}>
                <Button
                  onClick={() => this.setState({ open: 'dropzone', error: {} })}
                  variant={'contained'}
                  color={'primary'}
                  disabled={complete || pending}
                >
                  Upload Documents
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction={'row'}
              className={classnames(classes.grid, error.contact ? classes.error : '')}
            >
              <Grid
                item xs={12}
                sm={6}
                container={!(contact?.address?.name)}
                className={classes.left}
              >
                {contact?.address?.name ? (<List className={classes.half}>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText
                      inset
                      primary={contact?.address?.name}
                    />
                  </ListItem>
                </List>) : (
                  <OrderStepHeading step={2} label={'Add a shipping address'} />
                )}
              </Grid>
              <Grid container item xs={12} sm={6} className={classes.right}>
                <Button
                  onClick={() => this.setState({ open: 'addressbook', error: {} })}
                  variant={'contained'}
                  color={'primary'}
                  disabled={complete || pending}
                >
                  Add Recipient
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction={'row'}
              className={classnames(classes.grid, error.card ? classes.error : '')}
            >
              <Grid
                item
                xs={12}
                sm={6}
                className={classes.left}
                container={!user?.cards?.length}
              >
                {user?.cards?.length
                  ? (<PaymentMethods {...other} />)
                  : (<OrderStepHeading step={3} label={'Add a payment method'} />)}
              </Grid>
              <Grid container item xs={12} sm={6} className={classes.right}>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  onClick={() => this.setState({ open: 'stripe' })}
                  disabled={complete || pending}
                >Add Card</Button>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction={'row'}
              className={classnames(classes.grid, error.card ? classes.error : '')}
            >
              <Grid
                item
                xs={12}
                sm={6}
                className={classes.left}
                container
              >
                <OrderStepHeading step={4} label={'Add an email address'} />
              </Grid>
              <Grid container item xs={12} sm={6} className={classes.right}>
                <EditEmailTextFieldWithMutations {...other} />
              </Grid>
            </Grid>
            <Grid container item direction={'row'} className={classes.grid}>
              <Grid item xs={12}>
                <OrderDetailsOptions {...other} />
              </Grid>
            </Grid>
            <Grid container item direction={'row'} className={classes.grid}>
              {pending && <LinearProgress color={'primary'} />}
              <Grid item xs={12} sm={6} className={classes.left}>
                <FormControl required error={typeof error.terms !== 'undefined'} component={'fieldset'}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.accept}
                        onChange={evt => {
                          this.setState(prevState => ({
                            accept: !prevState.accept
                          }))
                        }}
                      />
                    }
                    label={<FormHelperText className={classes.formHelperText}><span>I accept the <a href='/terms'>terms and conditions</a></span></FormHelperText>}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={12} sm={6} className={classes.right}>
                <Quote
                  currentOrder={currentOrder}
                  classes={classes}
                />
                <Button
                  onClick={this.preSubmit}
                  variant={'contained'}
                  color={'primary'}
                  disabled={complete || pending}
                >
                  Review & Submit
                </Button>
              </Grid>
            </Grid>
            {letter && <OrderCard order={currentOrder} />}
          </Grid>
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
            window.localStorage.removeItem('item')
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
                    {(createCharge, { loading: chargeLoading }) => {
                      return (
                        <Mutation mutation={UPDATE_ORDER}>
                          {updateOrder => {
                            return (
                              <Mutation mutation={CREATE_LETTER}>
                                {(createLetter, { loading: letterLoading }) => {
                                  return (
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
                                  )
                                }}
                              </Mutation>
                            )
                          }}
                        </Mutation>
                      )
                    }}
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
