import React from 'react'
import { render } from 'react-dom'
import 'isomorphic-fetch'
import { ConnectedRouter, push } from 'connected-react-router'
import { ApolloProvider, withApollo, compose, Query } from 'react-apollo'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Route, Switch } from 'react-router-dom'
import { Provider, ReactReduxContext, connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import pages from './pages'
import createClient from './lib/apolloClient'
import { store, history, setLoadingState } from './lib/redux'
import theme from './theme'
import ValidationErrorsSnackbar from './components/ValidationErrorsSnackbar'
import GraphQLErrorsSnackbar from './components/GraphQLErrorsSnackbar'
import getToken from './lib/getToken'
import { SnackbarProvider, withSnackbar } from 'notistack'
import LoadingOverlay from './components/LoadingOverlay'
import './styles/main.scss'
import gql from 'graphql-tag'

const ORDER_QUERY = gql`
  query ($id: ID) {
    currentOrder(id: $id) {
      id
    }
  }
`

class App extends React.Component {
  state = {
    loading: true
  }

  async componentDidMount () {
    await getToken(this.props)
    this.setState({ loading: false })
  }

  render () {
    const appRoutes = this.state.loading
      ? []
      : pages
    return (
      <Query query={ORDER_QUERY}>
        {order => (
          <React.Fragment>
            <ValidationErrorsSnackbar />
            <GraphQLErrorsSnackbar />
            <React.Suspense fallback={<div />}>
              <Switch>
                {appRoutes.map(({ component: Component, ...rest }) => (
                  <Route {...rest} render={props => <Component {...props} {...this.props} order={order} />} />
                ))}
              </Switch>
            </React.Suspense>
            <CSSTransition
              in={this.props.app.loading}
              timeout={3000}
              classNames='loading'
              unmountOnExit
            >
              {state => {
                return (<LoadingOverlay paused={state === 'exiting'} />)
              }}
            </CSSTransition>
          </React.Fragment>
        )}
      </Query>
    )
  }
}

const ComposedApp = compose(
  connect(
    state => ({ app: state.root }),
    dispatch => ({
      setLoadingState: loading => dispatch(setLoadingState(loading)),
      redirect: pathname => dispatch(push(pathname))
    })
  ),
  withApollo,
  withSnackbar
)(App)

const client = createClient()

render(
  <ApolloProvider client={client}>
    <Provider store={store} context={ReactReduxContext}>
      <ConnectedRouter history={history} context={ReactReduxContext}>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ComposedApp />
          </SnackbarProvider>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
