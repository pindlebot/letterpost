const AWS = require('aws-sdk')

const { AWS_BUCKET, AWS_REGION, HEAL_SQS_QUEUE_URL, DYNAMODB_PREFIX } = process.env
const db = require('dynamodb-tools')
const ADDRESSES_TABLE = `${DYNAMODB_PREFIX}-addresses`
const ORDERS_TABLE = `${DYNAMODB_PREFIX}-orders`
const UPLOADS_TABLE = `${DYNAMODB_PREFIX}-uploads`
const CARDS_TABLE = `${DYNAMODB_PREFIX}-cards`
const OPTIONS_TABLE = `${DYNAMODB_PREFIX}-options`
const CONTACTS_TABLE = `${DYNAMODB_PREFIX}-contacts`
const CHARGES_TABLE = `${DYNAMODB_PREFIX}-charges`
const EVENTS_TABLE = `${DYNAMODB_PREFIX}-events`

const removeObjectsByPrefix = async ({ prefix }) => {
  const s3 = new AWS.S3({ region: AWS_REGION })
  const { Contents } = await s3.listObjects({
    Prefix: prefix,
    Bucket: AWS_BUCKET
  }).promise()
    .catch(console.error.bind(console))

  if (Contents && Contents.length) {
    s3.deleteObjects({
      Bucket: AWS_BUCKET,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key }))
      }
    }).promise()
      .catch(console.error.bind(console))
  }
}

async function removeAll (suffix, { user }) {
  const table = `${DYNAMODB_PREFIX}-${suffix}`
  const records = await db(table)
    .get({ user })
  return Promise.all(
    records.map(({ id }) =>
      db(table).remove({ id })
    )
  )
}

async function handleRemoveEvent (record, { modelName }) {
  let id = record.dynamodb.Keys.id.S
  let OldImage = record.dynamodb.OldImage

  switch (modelName) {
    case 'uploads':
      await removeObjectsByPrefix({ prefix: id })
      break
    case 'users':
      let user = record.dynamodb.Keys.id.S
      await removeAll('orders', { user })
      await removeAll('uploads', { user })
      await removeAll('cards', { user })
      await removeAll('contacts', { user })
      await removeAll('letters', { user })
      break
    case 'orders':
      if (OldImage.options) {
        await db(OPTIONS_TABLE).remove({ id: OldImage.options.S })
      }
      break
    case 'contacts':
      if (OldImage.address) {
        await db(ADDRESSES_TABLE).remove({ id: OldImage.address.S })
      }
      break
    case 'cards':
      let charges = await db(CHARGES_TABLE).get({ card: id })
      await Promise.all(charges.map(charge => db(CHARGES_TABLE).remove({ id: charge.id })))
      break
    case 'letters':
      let events = await db(EVENTS_TABLE).get({ letter: id })
      await Promise.all(events.map(event => db(EVENTS_TABLE).remove({ id: event.id })))
  }
}

async function handleModifyEvent (record, { modelName }) {
  let id = record.dynamodb.Keys.id.S

  switch (modelName) {
    case 'uploads':
      let NewImage = record.dynamodb.NewImage
      if (NewImage && NewImage.status && NewImage.status.S === 'ERROR') {
        console.log(`Removing uploads/${id}`)
        await db(UPLOADS_TABLE).remove({ id })
      }
  }
}

const sendMessage = async (record, { modelName }) => {
  console.log(JSON.stringify(record))
  let id = record.dynamodb.Keys.id.S
  let sqs = new AWS.SQS({
    region: AWS_REGION
  })
  await sqs.sendMessage({
    QueueUrl: HEAL_SQS_QUEUE_URL,
    MessageBody: id,
    MessageAttributes: {
      modelName: {
        DataType: 'String',
        StringValue: modelName
      }
    }
  }).promise()
    .catch(console.log.bind(console))
    .then(console.log.bind(console))
}

async function handleInsertEvent (record, { modelName }) {
  if (modelName === 'users') {
    let isUser = record.dynamodb.NewImage.role.S === 'USER'
    if (!isUser) {
      await sendMessage(record, { modelName })
    }
  }

  if (modelName === 'uploads') {
    await sendMessage(record, { modelName })
  }
}

const getModelName = (record) =>
  record.eventSourceARN.split(':')[5].split('/')[1].split('-')[3]

module.exports.handler = async (event, context, callback) => {
  let records = [...event.Records]
  while (records.length) {
    let record = records.shift()
    let modelName = getModelName(record)
    console.log({ modelName, eventName: record.eventName })
    if (record.eventName === 'MODIFY') {
      await handleModifyEvent(record, { modelName })
    }

    if (record.eventName === 'REMOVE') {
      await handleRemoveEvent(record, { modelName })
    }

    if (record.eventName === 'INSERT') {
      await handleInsertEvent(record, { modelName })
    }
  }

  callback(null, `Successfully processed ${event.Records.length} records.`)
}
