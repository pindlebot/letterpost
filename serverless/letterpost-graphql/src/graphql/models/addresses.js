const db = require('dynamodb-tools')
const { randomBytes } = require('crypto')
const ADDRESSES_TABLE = `${process.env.DYNAMODB_PREFIX}-addresses`

function create (input) {
  return db(ADDRESSES_TABLE)
    .set({
      id: randomBytes(5).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kind: 'RECIPIENT',
      ...input
    })
}

const get = (args) => db(ADDRESSES_TABLE).get(args)

const VALIDATION = {
  name: string => string.length,
  country: string => string.length,
  postalCode: string => /[\d-]{5,10}/.test(string),
  state: string => /[A-Za-z]{2, 14}/.test(string),
  street: string => string.length,
  city: string => /[A-Za-z\s-.,']{1,58}/.test(string),
  apt: () => true
}

const update = (params) => {
  if (params.postalCode) {
    if (!VALIDATION.postalCode(params.postalCode)) {

    }
  }
  return db(ADDRESSES_TABLE)
    .set({
      updatedAt: new Date().toISOString(),
      ...params
    })
}

const remove = (input) => db(ADDRESSES_TABLE)
  .remove(input)
  .then(() => input)

module.exports.remove = remove
module.exports.create = create
module.exports.get = get
module.exports.update = update
