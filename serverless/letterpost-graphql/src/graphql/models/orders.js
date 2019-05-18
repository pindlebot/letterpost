const { randomBytes } = require('crypto')
const db = require('dynamodb-tools')
const AWS = require('aws-sdk')
const Options = require('./options')
const ORDERS_TABLE = `${process.env.DYNAMODB_PREFIX}-orders`
const { AuthenticationError } = require('apollo-server-lambda')
const Contacts = require('./contacts')

const removeAttributes = ({ id, ...rest }) => {
  let keys = Object.keys(rest)
    .filter(key => rest[key] === null).join(', ')
  let client = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION })
  return client.update({
    TableName: ORDERS_TABLE,
    Key: { id },
    UpdateExpression: `REMOVE ${keys}`,
    ReturnValues: 'ALL_NEW'
  }).promise()
    .then(data => (data && data.Attributes) || undefined)
    .catch(error => {
      console.error(error)
      throw error
    })
}

async function update (input) {
  if (input.hasOwnProperty('contact') || input.hasOwnProperty('upload')) {
    if (input.contact === null || input.upload === null) {
      return removeAttributes(input)
    }
  }
  return db(ORDERS_TABLE)
    .set({
      updatedAt: new Date().toISOString(),
      ...input
    })
}

async function remove (input) {
  return db(ORDERS_TABLE).remove({ id: input.id })
}

async function create ({ user, contactId }) {
  const orderId = randomBytes(5).toString('hex')
  const optionsId = randomBytes(5).toString('hex')
  const params = {
    id: orderId,
    options: optionsId,
    createdAt: new Date().toISOString(),
    user: user
  }
  if (contactId) {
    params.contact = contactId
  }
  const order = await update(params)

  await Options.create({
    id: optionsId,
    order: orderId,
    doubleSided: false,
    color: true,
    returnEnvelope: false,
    extraService: 'none',
    mailType: 'usps_standard'
  })

  return order
}

const get = args => db(ORDERS_TABLE).get(args)

const getCurrentOrder = async (params) => {
  if (params.id) {
    let currentOrder = await get({ id: params.id })
    if (currentOrder.user !== params.user) {
      return new AuthenticationError('Unauthorized')
    }
    return currentOrder
  }
  let orders = await get({ user: params.user })
  orders = orders
    .filter(order => !order.paid)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  if (orders.length) {
    return orders[0]
  }
  let contact = await Contacts.create({ user: params.user })
  return create({
    user: params.user,
    contactId: contact.id
  })
}

module.exports.getCurrentOrder = getCurrentOrder
module.exports.get = get
module.exports.update = update
module.exports.create = create
module.exports.remove = remove
module.exports.TABLE = ORDERS_TABLE
