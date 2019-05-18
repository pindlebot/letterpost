const { randomBytes } = require('crypto')
const jwt = require('jsonwebtoken')
const {
  CLIENT_AUTH_ID,
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET
} = process.env
const pricing = require('./pricing.json')

function calculateFee (pages, options = {}) {
  const SURCHARGE = 2
  let {
    color = true,
    doubleSided = false,
    extraService = null,
    mailType = 'USPS_STANDARD'
  } = options
  let extraServiceFee = 0
  let extraPostageFee = 0
  color = color === true ? 'color' : 'black_and_white'
  extraService = extraService && extraService.toLowerCase()
  mailType = mailType.toLowerCase()
  let baseFee = pricing.mail_type[mailType][color].developer
  let perPage = pricing.per_page[color].developer

  if (doubleSided) {
    pages = Math.ceil(pages / 2)
  }

  if (extraService && extraService !== 'none') {
    extraServiceFee = pricing.extra_service[extraService].developer
  }

  if (pages > 6) {
    extraPostageFee = pricing['extra_postage_fee'].developer
  }

  console.log({
    baseFee,
    perPage,
    pages,
    extraPostageFee,
    extraServiceFee
  })
  let total = (baseFee + (perPage * pages) + extraPostageFee + extraServiceFee + SURCHARGE)
  return Math.floor(total * 100)
}

var re = /^[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+(:?\.[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i

function isEmail (email) {
  return re.test(email)
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

const createNonce = async (user) => {
  let clientId = user.password ? CLIENT_AUTH_ID : CLIENT_SESSION_ID
  let clientSecret = user.password || CLIENT_SESSION_SECRET
  let { token } = await createToken({
    sub: user.id,
    expiresIn: '1h',
    clientId,
    clientSecret
  })

  let nonce = `https://letterpost.co/auth?nonce=${token}`
  return nonce
}

module.exports.createNonce = createNonce
module.exports.createToken = createToken
module.exports.calculateFee = calculateFee
module.exports.isEmail = isEmail
