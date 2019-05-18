const AWS = require('aws-sdk')
const path = require('path')

const {
  download,
  uploadThumbnail,
  countPages
} = require('./util')
const { AWS_REGION } = process.env

const handleMessage = async (message) => {
  const { key: objectKey } = message
  const objectPrefix = path.dirname(objectKey)
  const params = {
    file: message.file,
    pdfPath: `/tmp/${objectPrefix}.pdf`,
    thumbnailPath: `/tmp/${objectPrefix}.jpg`,
    objectPrefix: message.objectPrefix,
    sub: message.sub
  }
  const errors = message.errors || []
  const steps = message.steps || []
  steps.push(process.env.AWS_LAMBDA_FUNCTION_NAME)

  await download(params)
  let { pages } = await countPages(params)
  await uploadThumbnail(params, errors)

  return {
    ...message,
    pages,
    steps,
    errors
  }
}

const sns = new AWS.SNS({ region: AWS_REGION })

const publish = (data, { topic }) => {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: topic
  }
  return sns.publish(params).promise()
}

module.exports.handler = async (event, context, callback) => {
  const { Records } = event
  await Promise.all(
    Records.map(async record => {
      let { Sns: { Message } } = record
      let message = JSON.parse(Message)
      let result = await handleMessage(message)
      console.log(result)
      await publish(result, {
        topic: process.env.WRAPUP_TOPIC_ARN
      })
      return publish(result, {
        topic: process.env.VERAPDF_TOPIC_ARN
      })
    })
  )
  callback(null, {})
}
