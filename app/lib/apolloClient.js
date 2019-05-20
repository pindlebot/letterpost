import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { GRAPHQL_ENDPOINT } from './config'

// const httpLink = createHttpLink({
//   uri: GRAPHQL_ENDPOINT
// })

// const authLink = setContext((_, { headers }) => {
//   const token = window.localStorage.getItem('token')
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : ''
//     }
//   }
// })

const customFetch = (uri, options) => {
  const token = window.localStorage.getItem('token')
  options.headers.authorization = token ? `Bearer ${token}` : ''
  return fetch(uri, options)
}

const link = new BatchHttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetch: customFetch,
  batchInterval: 100
})

export default () => new ApolloClient({
  link: link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  dataIdFromObject: object => object.id,
  shouldBatch: true
})
