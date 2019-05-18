
const db = require('dynamodb-tools')
const AWS = require('aws-sdk')
const path = require('path')

const {
  AWS_REGION = 'us-east-1',
  DYNAMODB_PREFIX,
  AWS_IOT_HOST
} = process.env

const UPLOADS_TABLE = `${DYNAMODB_PREFIX}-uploads`

const iot = new AWS.IotData({
  endpoint: AWS_IOT_HOST,
  region: AWS_REGION
})

const handleMessage = async (data) => {
  console.log(JSON.stringify(data))
  let { key, pages, resized, stats, steps } = data
  let objectPrefix = path.dirname(key)
  if (stats) {
    stats.endTime = Date.now()
    stats.duration = stats.endTime - stats.startTime
  }
  const params = {
    id: objectPrefix,
    key
  }
  if (isNaN(pages)) {
    params.status = 'ERROR'
  } else {
    params.pages = pages
    params.status = 'DONE'
  }

  let errors = data.errors
  let upload = await db(UPLOADS_TABLE).set(params).catch(err => {
    errors.push({ message: err.toString() })
  })

  return new Promise((resolve, reject) => {
    iot.publish({
      topic: `letterpost/${objectPrefix}/pdf`,
      payload: JSON.stringify({
        ...data,
        upload,
        params,
        errors,
        stats
      }),
      qos: 1
    }, resolve)
  })
}

module.exports.handler = async (event, context, callback) => {
  const { Records } = event
  await Promise.all(
    Records.map(record => {
      let { Sns: { Message } } = record
      let message = JSON.parse(Message)
      return handleMessage(message)
    })
  )
  callback(null, {})
}
