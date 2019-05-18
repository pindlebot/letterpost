const AWS = require('aws-sdk')
const { AWS_REGION = 'us-east-1' } = process.env
const sns = new AWS.SNS({ region: AWS_REGION })

module.exports.handler = async (event, context, callback) => {
  const { file, webhook, topicArn } = JSON.parse(event.body)
  console.log({ file, webhook, topicArn })
  const params = {
    Message: JSON.stringify({
      file: file,
      webhook: webhook || null,
      topicArn: topicArn || null
    }),
    TopicArn: process.env.SNS_TOPIC_ARN
  }
  let data = await sns.publish(params).promise()
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(data)
  })
}
