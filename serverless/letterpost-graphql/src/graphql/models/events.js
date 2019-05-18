const db = require('dynamodb-tools')

const EVENTS_TABLE = `${process.env.DYNAMODB_PREFIX}-events`

const create = (input) => db(EVENTS_TABLE)
  .set({
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input
  })

const remove = (input) => db(EVENTS_TABLE)
  .remove(input)
  .then(() => input)

const update = (input) => db(EVENTS_TABLE)
  .set(input)

const get = (args) => db(EVENTS_TABLE)
  .get(args)

module.exports.get = get
module.exports.create = create
module.exports.update = update
module.exports.remove = remove
module.exports.TABLE = EVENTS_TABLE
