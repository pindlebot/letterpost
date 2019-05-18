const resolvers = require('./resolvers')
const { ApolloServer, makeExecutableSchema } = require('apollo-server-lambda')
const DefaultDirective = require('./directives/DefaultDirective')
const AuthDirective = require('./directives/AuthDirective')
const path = require('path')
const fs = require('fs')
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

const getUserId = (event) => {
  return event.requestContext &&
    event.requestContext.authorizer &&
    event.requestContext.authorizer.principalId
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    default: DefaultDirective,
    auth: AuthDirective
  }
})

const server = new ApolloServer({
  schema,
  context: ({ event, context }) => {
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      user: getUserId(event)
    }
  }
  // tracing: true,
  // cacheControl: true,
  // engine: false
})

module.exports = server
