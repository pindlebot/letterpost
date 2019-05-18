const { randomBytes } = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('dynamodb-tools')
const bcrypt = require('bcryptjs')
const Addresses = require('./addresses')
const AWS = require('aws-sdk')
const sns = new AWS.SNS({ region: process.env.AWS_REGION || 'us-east-1' })
const { ValidationError } = require('apollo-server-lambda')
const { isEmail } = require('../util')
const { sendUserConfirmationEmail } = require('../email')
const {
  CLIENT_AUTH_ID,
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET,
  DYNAMODB_PREFIX,
  SES_TOPIC_ARN
} = process.env

const Hash = require('../hash')
const USERS_TABLE = `${DYNAMODB_PREFIX}-users`

const update = (params) => {
  if (params.emailAddress) {
    if (!isEmail(params.emailAddress)) {
      throw new ValidationError('Email address is invalid')
    }
  }
  return db(USERS_TABLE)
    .set({
      updatedAt: new Date().toISOString(),
      ...params
    })
}

const remove = (input) => db(USERS_TABLE)
  .remove(input)
  .then(() => input)

const get = (args) => db(USERS_TABLE).get(args)

const getUserByEmail = ({ emailAddress }) => {
  return get({ emailAddress })
    .then(users => users && users.length
      ? users[0]
      : undefined
    )
}

async function createToken ({
  sub = randomBytes(5).toString('hex'),
  expiresIn = '72h',
  clientId,
  clientSecret
}) {
  const payload = {
    sub
  }

  const options = {
    audience: clientId,
    expiresIn: expiresIn
  }

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      clientSecret,
      options,
      (err, token) => {
        if (err) reject(err)
        else resolve({ token, payload })
      }
    )
  })
}

async function createSession ({ user }) {
  let address = await Addresses.create({ user, kind: 'SENDER' })
  let data = await update({
    role: 'SESSION',
    id: user,
    returnAddress: address.id,
    createdAt: new Date().toISOString()
  })
  return data
}

async function create ({ id, emailAddress, password }) {
  const hash = new Hash({ password, emailAddress })
  let exists = await hash.getUserByEmail()
  if (!exists) {
    let hashed = await hash.create()
    let user = await update({
      id,
      emailAddress,
      password: hashed,
      role: 'USER'
    }).catch(err => {
      throw err
    })
    await sendUserConfirmationEmail(user)
    return user
  } else {
    throw new ValidationError('User exists')
  }
}

async function signin ({ emailAddress, password }) {
  const hash = new Hash({ emailAddress, password })
  const state = await hash.verify()
  if (state && state.result) {
    const jwt = await createToken({
      sub: state.user.id,
      clientSecret: state.user.password,
      clientId: CLIENT_AUTH_ID
    })
    await update({
      id: state.user.id,
      token: jwt.token,
      role: 'USER',
      updatedAt: new Date().toISOString()
    })
    return { ...state.user, token: jwt.token }
  }
}

function emailInUse ({ emailAddress, user }) {
  if (!isEmail(emailAddress)) {
    throw new ValidationError('Email address is invalid')
  }

  return db(USERS_TABLE).get({ emailAddress })
    .then(data => Boolean(data && data.length))
}

async function resetPassword ({ emailAddress, user: userId }) {
  let user = await getUserByEmail({ emailAddress })
  if (user) {
    let clientId = user.password ? CLIENT_AUTH_ID : CLIENT_SESSION_ID
    let clientSecret = user.password || CLIENT_SESSION_SECRET
    let { token } = await createToken({
      sub: user.id,
      expiresIn: '1h',
      clientId,
      clientSecret
    })

    let href = 'https://letterpost.co/auth?nonce=' + token
    const params = {
      Message: JSON.stringify({
        emailAddress: user.emailAddress,
        variables: {
          href
        },
        templateType: 'reset'
      }),
      TopicArn: SES_TOPIC_ARN
    }
    console.log(params)
    await sns.publish(params).promise()
    return true
  }
  return false
}

async function updatePassword ({ password, user: userId }) {
  if (password.length < 5) {
    throw new ValidationError('Passwords must be at least 5 characters')
  }
  const user = await get({ id: userId })

  if (!user.emailAddress) {
    throw new ValidationError('Please add an email address before adding a password')
  }

  if (user.role !== 'USER') {
    await sendUserConfirmationEmail(user)
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return update({
    id: userId,
    password: hash,
    role: 'USER'
  })
}

module.exports.updatePassword = updatePassword
module.exports.emailInUse = emailInUse
module.exports.resetPassword = resetPassword
module.exports.createSession = createSession
module.exports.signin = signin
module.exports.update = update
module.exports.create = create
module.exports.remove = remove
module.exports.get = get
module.exports.getUserByEmail = getUserByEmail
