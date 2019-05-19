import React from 'react'
import PropTypes from 'prop-types'
import { withApollo, compose, Mutation, Query } from 'react-apollo'
import Button from '@material-ui/core/Button'
import mutations from './mutations'
import Typography from '@material-ui/core/Typography'
import PasswordField from 'PasswordField'
import Spinner from 'Spinner'
import { withStyles } from '@material-ui/core/styles'
import SignInEmailTextField from 'SignInEmailTextField'
import { withRouter } from 'react-router-dom'
import styles from './styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'
import { RESET_PASSWORD } from '../../graphql/mutations'
import { USER_QUERY } from '../../graphql/queries'
import { connect } from 'react-redux'
import { setGraphQLErrors } from '../../lib/redux'
import { push } from 'connected-react-router'
import { parse } from 'query-string'

class Signin extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    create: PropTypes.func,
    signin: PropTypes.func
  }

  state = {
    emailAddress: '',
    password: '',
    tab: 0,
    passwordResetSent: false
  }

  handleTabChange = ({ currentTarget }, value) => {
    this.setState({ tab: value })
  }

  componentDidMount () {
    const params = parse(this.props.location.search)
    const { user: { data: { user } } } = this.props
    if (user.role === 'USER') {
      this.redirect(`/order/${user.currentOrder.id}`)
    } else {
      this.props.setLoadingState(false)
    }
  }

  signin = () => {
    const { emailAddress, password } = this.state
    this.setState({ loading: true }, () => {
      this.props.signin({ emailAddress, password })
        .then(({ data: { signinUser } }) => {
          this.redirect('/order')
        })
        .catch(err => this.props.setGraphQLErrors(err.graphQLErrors))
    })
  }

  redirect = (pathname) => {
    const params = parse(this.props.location.search)
    if (params.action) {
      this.props.redirect(`/${params.action}`)
    } else {
      this.props.redirect(pathname)
    }
  }

  createAccount = async () => {
    const { emailAddress, password } = this.state
    return this.props.create({
      emailAddress,
      password
    }).catch(err => this.props.setGraphQLErrors(err.graphQLErrors))
      .then(({ data: { signinUser } }) => {
        this.redirect('/order')
      })
  }

  resetPassword = mutate => () => mutate({
    variables: {
      emailAddress: this.state.emailAddress
    }
  }).then(() => {
    this.setState({
      password: '',
      emailAddress: '',
      passwordResetSent: true
    })
  })

  render () {
    const { emailAddress, password, tab, passwordResetSent } = this.state
    const { classes, user: { data: { user } } } = this.props
    const login = tab === 0
    return (
      <Mutation mutation={RESET_PASSWORD}>
        {mutate => {
          return (
            <div className={classes.container}>
              <div className={classes.inset}>
                <div className={classes.left}>
                  <form className={classes.login}>
                    <Typography align='center' variant='h5' className={classes.title}>
                      LetterPost.co
                    </Typography>
                    <Tabs
                      value={this.state.tab}
                      onChange={this.handleTabChange}
                    >
                      <Tab label={'Login/Create Account'} />
                      <Tab label={'Reset Password'} />
                    </Tabs>
                    <Grid container direction={'column'} spacing={24} style={{ padding: '20px 0' }}>
                      {passwordResetSent && (
                        <Grid item>
                          Password reset email sent!
                        </Grid>
                      )}
                      <Grid item>
                        <SignInEmailTextField
                          value={emailAddress}
                          onChange={e => this.setState({ emailAddress: e.target.value })}
                        />
                      </Grid>
                      {login && (<Grid item>
                        <PasswordField
                          value={password}
                          onChange={e => this.setState({ password: e.target.value })}
                        />
                      </Grid>)}
                      <Grid item container xs={12} justify={'space-between'} style={{marginTop: 20}}>
                        {login ? (
                          <React.Fragment>
                            <Grid item xs={4}>
                              <Button onClick={this.signin}>
                                      Sign in {this.state.loading ? <Spinner /> : ''}
                              </Button>
                            </Grid>
                            <Grid container item xs={6} justify={'flex-end'}>
                              <Button
                                variant={'contained'}
                                onClick={this.createAccount}
                                color={'primary'}
                              >
                                Create account
                              </Button>
                            </Grid>
                          </React.Fragment>
                        ) : (
                          <Grid container item xs={12} justify={'flex-end'}>
                            <Button onClick={this.resetPassword(mutate)}>Reset</Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </form>
                </div>
                <div className={classes.right} />
              </div>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default compose(
  withApollo,
  ...mutations,
  connect(
    state => state,
    dispatch => ({
      setGraphQLErrors: error => dispatch(setGraphQLErrors(error)),
      clearGraphQLErrors: () => dispatch({ type: 'CLEAR_GRAPHQL_ERRORS' }),
      redirect: (pathname) => dispatch(push(pathname))
    })
  ),
  withStyles(styles),
  withRouter
)(props => (
  <Query query={USER_QUERY}>
    {user => {
      if (user.loading) return false
      return (
        <Signin {...props} user={user} />
      )
    }}
  </Query>
))
