const AWS = require('aws-sdk')
const { AWS_REGION, AWS_BUCKET } = process.env
const path = require('path')

module.exports = async ({ id, name, ext, key, sub }) => {
  const s3 = new AWS.S3({ region: AWS_REGION })
  const { Body } = await s3.getObject({
    Key: key,
    Bucket: AWS_BUCKET
  }).promise()
  const html = Body.toString('utf8')
  const sns = new AWS.SNS({ region: AWS_REGION })
  const params = {
    Message: JSON.stringify({
      key: `${id}/${name}.pdf`,
      html: html,
      sub
    }),
    TopicArn: process.env.CHROMELESS_TOPIC_ARN
  }
  return sns.publish(params).promise()
}
