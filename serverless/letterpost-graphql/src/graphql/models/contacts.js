const db = require('dynamodb-tools')
const { randomBytes } = require('crypto')
const Orders = require('./orders')
const Addresses = require('./addresses')

const CONTACTS_TABLE = `${process.env.DYNAMODB_PREFIX}-contacts`

const update = (input) => db(CONTACTS_TABLE)
  .set(input)

async function create ({ user }) {
  let contactId = randomBytes(5).toString('hex')
  let addressId = randomBytes(5).toString('hex')

  await Addresses.update({
    id: addressId,
    contact: contactId,
    user: user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  return update({
    id: contactId,
    address: addressId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: user
  })
}

async function remove (input) {
  let orders = await Orders.get({ contact: input.id })
  await Promise.all(orders.map(o =>
    Orders.update({ id: o.id, contact: null })
  ))
  return db(CONTACTS_TABLE)
    .remove({ id: input.id })
    .then(() => input)
}

const get = args => db(CONTACTS_TABLE)
  .get(args)

module.exports.update = update
module.exports.get = get
module.exports.remove = remove
module.exports.create = create
