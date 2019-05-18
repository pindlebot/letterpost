const _ = require('lodash')
const db = require('dynamodb-tools')

const stripe = require('../stripe')
const { randomBytes } = require('crypto')
const Users = require('./users')

const USERS_TABLE = `${process.env.DYNAMODB_PREFIX}-users`
const CARDS_TABLE = `${process.env.DYNAMODB_PREFIX}-cards`

function formatStripeSource (source) {
  let card = _.mapKeys(source, (value, key) => _.camelCase(key))
  return _.pick(card, [
    'cvcCheck',
    'last4',
    'expMonth',
    'expYear',
    'brand',
    'country'
  ])
}

async function create (input) {
  const { stripeTokenId, stripeEmail, user } = input
  const source = await stripe.createSource({ stripeTokenId, stripeEmail })
  const cardId = randomBytes(5).toString('hex')

  const card = {
    ...formatStripeSource(source),
    id: cardId,
    user: user,
    stripeTokenId: stripeTokenId,
    stripeSourceId: source.id,
    stripeCustomerId: source.customer,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await db(USERS_TABLE)
    .set({ id: user, primaryCard: cardId })

  return db(CARDS_TABLE)
    .set(card)
}

const get = args => db(CARDS_TABLE).get(args)

const update = (input) => db(CARDS_TABLE)
  .set({
    updatedAt: new Date().toISOString(),
    ...input
  })

const remove = async ({ user, id }) => {
  await Users.update({
    id: user,
    primaryCard: null
  })
  return db(CARDS_TABLE).remove({ id })
}

module.exports.remove = remove
module.exports.create = create
module.exports.get = get
module.exports.update = update
