const AWS = require('aws-sdk')
const { AWS_REGION, HEAL_SQS_QUEUE_URL, DYNAMODB_PREFIX } = process.env
const db = require('dynamodb-tools')
const USERS_TABLE = `${DYNAMODB_PREFIX}-users`
const UPLOADS_TABLE = `${DYNAMODB_PREFIX}-uploads`

let sqs = new AWS.SQS({ region: AWS_REGION })

const processUpload = async (message, end) => {
  const { Body, Attributes, MessageAttributes } = message
  const upload = await db(UPLOADS_TABLE).get({ id: Body })
  if (!upload) {
    return end()
  }

  if (upload.status !== 'DONE') {
    if (parseInt(Attributes.SentTimestamp) < (Date.now() - 5 * 60 * 1000)) {
      console.log(`Removing "uploads/${Body}"`)
      await db(UPLOADS_TABLE).remove({ id: Body })
      return end()
    }
  } else {
    return end()
  }
}

const processSession = async (message, end) => {
  let { Body, Attributes, MessageAttributes } = message
  let user = await db(USERS_TABLE).get({ id: Body })
  if (!(
    user &&
    user.role === 'SESSION' &&
    user.createdAt === user.updatedAt
  )) {
    return end()
  }
  if (parseInt(Attributes.SentTimestamp) < (Date.now() - 11 * 60 * 60 * 1000)) {
    await db(USERS_TABLE).remove({ id: Body })
      .then(console.log.bind(console))
    await end()
  } else {
    const VisibilityTimeout = 43200 - ((Date.now() - parseInt(Attributes.SentTimestamp)) * 1000)
    await sqs.changeMessageVisibility({
      QueueUrl: HEAL_SQS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle,
      VisibilityTimeout: VisibilityTimeout
    }).promise()
  }
}

const processMessage = async (message) => {
  const end = async () => {
    await sqs.deleteMessage({
      QueueUrl: HEAL_SQS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle
    }).promise()
  }

  const { MessageAttributes } = message
  const modelName = MessageAttributes.modelName.StringValue
  switch (modelName) {
    case 'uploads':
      await processUpload(message, end)
      break
    case 'users':
      await processSession(message, end)
      break
  }
}

module.exports.handler = async (event, context, callback) => {
  let data = await sqs.receiveMessage({
    QueueUrl: HEAL_SQS_QUEUE_URL,
    AttributeNames: ['All'],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All']
  }).promise()

  if (!(data.Messages && data.Messages.length)) {
    return callback(null, {})
  }

  let messages = data.Messages
  while (messages.length) {
    await processMessage(messages.shift())
  }
  callback(null, {})
}
