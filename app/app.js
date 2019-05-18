import React from 'react'
import { render } from 'react-dom'
import 'isomorphic-fetch'
import { ConnectedRouter, push } from 'connected-react-router'
import { ApolloProvider, withApollo, compose } from 'react-apollo'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Route, Switch } from 'react-router-dom'
import { Provider, ReactReduxContext, connect } from 'react-redux'
import pages, { LoadingOverlay } from './pages'
import './styles/main.scss'
import createClient from './lib/apolloClient'
import { store, history, setLoadingState } from './lib/redux'
import theme from './theme'
import ValidationErrorsSnackbar from './components/ValidationErrorsSnackbar'
import GraphQLErrorsSnackbar from './components/GraphQLErrorsSnackbar'
import getToken from './lib/getToken'
import { CSSTransition } from 'react-transition-group'

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
      <React.Fragment>
        <ValidationErrorsSnackbar />
        <GraphQLErrorsSnackbar />
        <React.Suspense fallback={<div />}>
          <Switch>
            {appRoutes.map(({ component: Component, ...rest }) => (
              <Route {...rest} render={props => <Component {...props} {...this.props} />} />
            ))}
            <CSSTransition
              in={this.props.app.loading}
              timeout={1000}
              classNames='loading'
              unmountOnExit
            >
              {state => <LoadingOverlay />}
            </CSSTransition>
          </Switch>
        </React.Suspense>
      </React.Fragment>
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
  withApollo
)(App)

const client = createClient()

render(
  <ApolloProvider client={client}>
    <Provider store={store} context={ReactReduxContext}>
      <ConnectedRouter history={history} context={ReactReduxContext}>
        <MuiThemeProvider theme={theme}>
          <ComposedApp />
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
