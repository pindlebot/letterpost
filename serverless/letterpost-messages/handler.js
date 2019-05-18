const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: process.env.AWS_REGION || 'us-east-1' })
const mailParse = require('mailparser').simpleParser
const db = require('dynamodb-tools')
const { DYNAMODB_PREFIX, AWS_BUCKET } = process.env
const crypto = require('crypto')
const MESSAGES_TABLE = `${DYNAMODB_PREFIX}-messages`

async function parse (key) {
  let body
  try {
    const data = await s3.getObject({
      Key: key,
      Bucket: AWS_BUCKET
    }).promise()
    body = data.Body
  } catch (err) {
    return {}
  }
  let decoded
  try {
    decoded = await mailParse(body.toString())
  } catch (err) {
    return {}
  }
  return decoded
}

function stripEmptyStrings (entity) {
  return Object.keys(entity).reduce((acc, key) => {
    let value = entity[key]
    if (value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}

function stripEmptyStringsFromArray (entities) {
  return entities.map(stripEmptyStrings)
}

module.exports.handler = async (event, context, callback) => {
  let { Records } = event
  let { Sns: { Message } } = Records[0]
  let message = JSON.parse(Message)
  console.log(JSON.stringify(message))
  let { receipt: { action: { objectKey } } } = message
  let decoded = await parse(objectKey)
  console.log(JSON.stringify(decoded))
  let data = {
    id: crypto.randomBytes(10).toString('hex'),
    ...message,
    ...decoded
  }
  data.date = data.date.toString()
  data.to.value = stripEmptyStringsFromArray(data.to.value)
  data.from.value = stripEmptyStringsFromArray(data.from.value)
  await db(MESSAGES_TABLE).set(data)
  callback(null, {})
}
