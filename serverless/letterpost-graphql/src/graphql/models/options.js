const db = require('dynamodb-tools')
const OPTIONS_TABLE = `${process.env.DYNAMODB_PREFIX}-options`
const { calculateFee } = require('../util')

async function update ({ id, ...rest }) {
  return db(OPTIONS_TABLE)
    .set({
      id,
      ...rest,
      updatedAt: new Date().toISOString()
    })
}

const create = (input) => {
  return db(OPTIONS_TABLE)
    .set({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extraService: 'none',
      mailType: 'usps_standard',
      ...input
    })
}

const remove = (input) => {
  return db(OPTIONS_TABLE)
    .remove(input)
    .then(() => input)
}

const get = (args) => db(OPTIONS_TABLE)
  .get(args)

module.exports.get = get
module.exports.update = update
module.exports.create = create
module.exports.remove = remove
