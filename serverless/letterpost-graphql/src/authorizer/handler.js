const jwt = require('jsonwebtoken')
const db = require('dynamodb-tools')
const USERS_TABLE = `${process.env.DYNAMODB_PREFIX}-users`
const {
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET,
  CLIENT_AUTH_ID
} = process.env

const generatePolicy = (token, principalId, effect, resource) => {
  const authResponse = {}
  authResponse.context = {}
  authResponse.context.token = token
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

module.exports.handler = async (event, context, cb) => {
  if (event.authorizationToken) {
    const token = event.authorizationToken.substring(7)
    const options = {}
    let clientSecret

    let decoded = jwt.decode(token)
    if (decoded.aud === CLIENT_SESSION_ID) {
      options.audience = CLIENT_SESSION_ID
      clientSecret = CLIENT_SESSION_SECRET
    } else if (decoded.aud === CLIENT_AUTH_ID) {
      options.audience = CLIENT_AUTH_ID
      try {
        let user = await db(USERS_TABLE).get({ id: decoded.sub })
        clientSecret = user.password
      } catch (err) {
        return cb(err)
      }
    }
    jwt.verify(token, clientSecret, options, (err, decoded) => {
      if (err) {
        cb(err)
      } else {
        cb(null, generatePolicy(token, decoded.sub, 'Allow', event.methodArn))
      }
    })
  } else {
    cb(new Error('Unauthorized'), null)
  }
}
