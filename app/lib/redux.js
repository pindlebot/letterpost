import * as redux from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

const initialState = {
  loading: true,
  snackbar: {
    show: true
  },
  validationErrors: {},
  graphQLErrors: [],
  location: null
}

const SET_ORDER = 'SET_ORDER'
const SET_CONTACT = 'SET_CONTACT'
const SET_LOADING_STATE = 'SET_LOADING_STATE'
const SHOW_SNACKBAR = 'SHOW_SNACKBAR'
const CLEAR_SNACKBAR = 'CLEAR_SNACKBAR'
const SET_VALIDATION_ERROR = 'SET_VALIDATION_ERRORS'
const CLEAR_VALIDATION_ERROR = 'CLEAR_VALIDATION_ERROR'
const SET_GRAPHQL_ERRORS = 'SET_GRAPHQL_ERRORS'
const CLEAR_GRAPHQL_ERRORS = 'CLEAR_GRAPHQL_ERRORS'
const ROUTER_LOCATION_CHANGE = '@@router/LOCATION_CHANGE'
const SET_LOCATION = 'SET_LOCATION'

export const setLocation = payload => ({
  type: SET_LOCATION,
  payload
})

export const setOrder = payload => ({
  type: SET_ORDER,
  payload
})

export const setContact = payload => ({
  type: SET_CONTACT,
  payload
})

export const setLoadingState = payload => ({
  type: SET_LOADING_STATE,
  payload
})

export const setValidationError = payload => ({
  type: SET_VALIDATION_ERROR,
  payload
})

export const clearValidationError = payload => ({
  type: CLEAR_VALIDATION_ERROR,
  payload
})

export const setGraphQLErrors = payload => ({
  type: SET_GRAPHQL_ERRORS,
  payload
})

export const clearGraphQLErrors = payload => ({
  type: CLEAR_GRAPHQL_ERRORS,
  payload
})

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload
      }
    case ROUTER_LOCATION_CHANGE:
      return {
        ...state,
        location: action.payload.location.pathname !== '/signin'
          ? null
          : state.location,
        loading: true
      }
    case SET_GRAPHQL_ERRORS:
      return {
        ...state,
        graphQLErrors: action.payload,
        snackbar: {
          show: true
        }
      }
    case CLEAR_GRAPHQL_ERRORS:
      return {
        ...state,
        graphQLErrors: [],
        snackbar: {
          show: true
        }
      }
    case SET_VALIDATION_ERROR:
      return {
        ...state,
        validationErrors: {
          ...(state.validationErrors || {}),
          ...action.payload
        }
      }
    case CLEAR_VALIDATION_ERROR:
      let { validationErrors } = state
      delete validationErrors[action.payload]
      return {
        ...state,
        validationErrors,
        snackbar: {
          show: true
        }
      }
    case CLEAR_SNACKBAR:
      return {
        ...state,
        snackbar: {
          show: false
        }
      }
    case SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: {
          show: true
        }
      }
    case SET_LOADING_STATE:
      return {
        ...state,
        loading: action.payload
      }
    case SET_ORDER:
      return {
        ...state,
        order: action.payload
      }
    case SET_CONTACT:
      return {
        ...state,
        contact: action.payload
      }
    default:
      return state
  }
}

export const rootReducer = redux.combineReducers({
  router: connectRouter(history),
  root: reducer
})

export const store = redux.createStore(
  rootReducer,
  redux.compose(
    redux.applyMiddleware(
      routerMiddleware(history)
    )
  )
)
