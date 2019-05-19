import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Layout from 'Layout'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { withRouter } from 'react-router-dom'
import EditEmailTextField from 'EditEmailTextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import { ORDERS_QUERY, USER_QUERY } from '../../graphql/queries'
import { UPDATE_USER, DELETE_USER } from '../../graphql/mutations'
import OrderCard from 'OrderCard'
import EditPasswordTextField from 'EditPasswordTextField'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { setGraphQLErrors } from '../../lib/redux'
import { push } from 'connected-react-router'
import Button from '@material-ui/core/Button'
import DeleteAccountConfirmationDialog from 'DeleteAccountConfirmationDialog'

const styles = theme => ({
  h1: {
    color: 'rgba(23,42,58,1)',
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
    backgroundColor: '#fff',
    borderRadius: 3,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 #e6ebf1',
    transition: 'box-shadow 150ms ease'
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
  }
})

class NameTextField extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }
  state = {
    name: this.props.user.data.user.name || '',
    disabled: Boolean(this.props.user.data.user.name)
  }

  onChange = ({ currentTarget }) => {
    this.setState({ name: currentTarget.value })
  }

  toggleEdit = () => {
    let { disabled, name } = this.state
    let { user: { data: { user } } } = this.props
    if (!disabled) {
      this.props.updateUser({
        input: {
          id: user.id,
          name: name
        }
      })
    }
    this.setState(prevState => ({
      disabled: !prevState.disabled
    }))
  }

  render () {
    const { classes } = this.props
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor='adornment-email-address'>
          Name
        </InputLabel>
        <Input
          id='adornment-name'
          type={'text'}
          value={this.state.name}
          onChange={this.onChange}
          disabled={this.state.disabled}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label={'Edit'}
                onClick={this.toggleEdit}
                onMouseDown={evt => {
                  evt.preventDefault()
                }}
              >
                {this.state.disabled ? <EditIcon /> : <SaveIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    )
  }
}

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
                    <DeleteAccountConfirmationDialog
                      handleClose={this.handleDialogClose}
                      open={this.state.dialog === 'DELETE_ACCOUNT'}
                      user={user}
                    />
                    <div className={classes.main}>
                      <Grid
                        container
                        direction={'column'}
                        spacing={40}
                      >
                        <Grid
                          container
                          item
                          direction={'row'}
                          className={classes.grid}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            className={classes.left}
                            container
                          >
                            <Typography
                              variant='body1'
                              align='left'
                              className={classes.h1}
                              gutterBottom
                            >
                              Account
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={9}
                            className={classes.right}
                            container
                            spacing={24}
                            direction={'row'}
                            wrap={'wrap'}
                          >
                            <Grid item sm={6} xs={12}>
                              <EditEmailTextField
                                user={this.props.user}
                                client={this.props.client}
                                updateUser={this.updateUser(mutate)}
                                loading={loading}
                                setGraphQLErrors={this.props.setGraphQLErrors}
                              />
                            </Grid>
                            <Grid item sm={6} xs={12}>
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
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          item
                          direction={'row'}
                          className={classes.grid}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            className={classes.left}
                            container
                          >
                            <Typography
                              variant='body1'
                              align='left'
                              className={classes.h4}
                              gutterBottom
                            >
                              Danger Zone
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={9}
                            className={classes.right}
                            container
                            justify={'flex-end'}
                          >
                            <Button
                              disabled={this.props.user.data.user.role !== 'USER'}
                              onClick={() => {
                                this.setState({ dialog: 'DELETE_ACCOUNT' })
                              }}>Delete Account</Button>
                          </Grid>
                        </Grid>
                      </Grid>
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
