const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const {
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET,
  CLIENT_AUTH_ID,
  DYNAMODB_PREFIX
} = process.env

const db = require('dynamodb-tools')
const USERS_TABLE = `${DYNAMODB_PREFIX}-users`

const createResponse = data => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  statusCode: 200,
  body: JSON.stringify(data)
})

function sign (payload) {
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      CLIENT_SESSION_SECRET, {
        expiresIn: '168h',
        audience: CLIENT_SESSION_ID
      },
      (err, token) => {
        if (err) reject(err)
        else resolve({ token })
      }
    )
  )
}

async function verify ({
  token = null
}) {
  const payload = {
    sub: randomBytes(10).toString('hex')
  }

  if (token) {
    let options = {}
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
        return sign(payload)
      }
    }
    return new Promise((resolve, reject) =>
      jwt.verify(token, clientSecret, options, (err, decoded) => {
        if (err) reject(err)
        else resolve({ token })
      }).catch(() => {
        return sign(payload)
      })
    )
  }
  return sign(payload)
}

module.exports.handler = (event, context, cb) => {
  let data = event.body ? JSON.parse(event.body) : {}
  verify(data).then(({ token }) => {
    cb(null, createResponse({ token }))
  }).catch((err) => {
    cb(createResponse({ err }))
  })
}
