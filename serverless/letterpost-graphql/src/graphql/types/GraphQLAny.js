const { Kind } = require('graphql/language')
const { GraphQLScalarType } = require('graphql')

const MAX_INT = 2147483647
const MIN_INT = -2147483648
const coerceIntString = (value) => {
  if (Array.isArray(value)) {
    throw new TypeError(`IntString cannot represent an array value: [${String(value)}]`)
  }
  if (Number.isInteger(value)) {
    if (value < MIN_INT || value > MAX_INT) {
      throw new TypeError(`Value is integer but outside of valid range for 32-bit signed integer: ${String(value)}`)
    }
    return value
  }
  return String(value)
}

const GraphQLAny = new GraphQLScalarType({
  name: 'Any',
  serialize: coerceIntString,
  parseValue: coerceIntString,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      return coerceIntString(parseInt(ast.value, 10))
    }
    if (ast.kind === Kind.STRING) {
      return ast.value
    }
    if (ast.kind === Kind.BOOLEAN) {
      return ast.value
    }
    if (ast.kind === Kind.ENUM) {
      return ast.value
    }
    if (ast.kind === Kind.NULL) {
      return ast.value
    }
    return undefined
  }
})

module.exports = GraphQLAny
