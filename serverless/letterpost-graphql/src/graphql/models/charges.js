const stripe = require('../stripe')
const db = require('dynamodb-tools')
const { randomBytes } = require('crypto')
const Users = require('./users')
const Cards = require('./cards')
const mapKeys = require('lodash.mapkeys')
const camelCase = require('lodash.camelcase')
const Orders = require('./orders')
const Options = require('./options')
const Uploads = require('./uploads')
const { calculateFee } = require('../util')

const CHARGES_TABLE = `${process.env.DYNAMODB_PREFIX}-charges`

const get = args => db(CHARGES_TABLE)
  .get(args)

const update = (input) => db(CHARGES_TABLE)
  .set(input)

const remove = (input) => db(CHARGES_TABLE)
  .remove(input)
  .then(() => input)

async function create ({ user: userId, orderId }) {
  const user = await Users.get({ id: userId })
  const { primaryCard } = user
  const card = await Cards.get({ id: primaryCard })
  const order = await Orders.get({ id: orderId })
  const options = await Options.get({ id: order.options })
  const upload = await Uploads.get({ id: order.upload })
  let amount = calculateFee(upload.pages, options)
  let result = await stripe.charge({
    amount: amount,
    stripeCustomerId: card.stripeCustomerId
  })
  result = mapKeys(result, (value, key) => camelCase(key))
  let chargeId = randomBytes(5).toString('hex')
  await Orders.update({
    id: orderId,
    charge: chargeId,
    paid: true
  })
  return update({
    id: chargeId,
    user: userId,
    order: orderId,
    card: primaryCard,
    status: result.status,
    amount: amount,
    createdAt: new Date().toISOString()
  })
}

module.exports.remove = remove
module.exports.update = update
module.exports.get = get
module.exports.create = create
