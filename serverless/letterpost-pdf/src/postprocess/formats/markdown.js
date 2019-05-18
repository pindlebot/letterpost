const AWS = require('aws-sdk')
const { AWS_REGION, AWS_BUCKET } = process.env
const marked = require('marked')

module.exports = async ({ key, id, name, sub }) => {
  const s3 = new AWS.S3({ region: AWS_REGION })
  const { Body } = await s3.getObject({
    Key: key,
    Bucket: AWS_BUCKET
  }).promise()
  let markdown = Body.toString('utf8')
  let html = marked(markdown)
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
