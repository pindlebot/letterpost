const { SchemaDirectiveVisitor } = require('apollo-server-lambda')
const { defaultFieldResolver } = require('graphql')

class DefaultDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    const { value } = this.args
    const { name } = this.visitedType
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args)
      if (typeof result === 'undefined') {
        return value
      }
      return result
    }
  }
}

module.exports = DefaultDirective
