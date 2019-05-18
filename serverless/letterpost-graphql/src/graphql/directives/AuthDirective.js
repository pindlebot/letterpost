const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-lambda')
const { defaultFieldResolver } = require('graphql')

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject (objectType) {
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true
    const fields = objectType.getFields()
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (...args) {
        let [obj, params, ctx] = args
        const result = await resolve.apply(this, args)
        if (obj && obj.user) {
          if (obj.user !== ctx.user) {
            throw new AuthenticationError(
              'You are not authorized to view this resource.'
            )
          }
        }
        return result
      }
    })
  }
}

module.exports = AuthDirective
