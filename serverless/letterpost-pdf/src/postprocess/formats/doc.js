const fetch = require('node-fetch')
const { sign } = require('../util')
const AWS = require('aws-sdk')
const {
  WORD_CONVERT_ENDPOINT,
  DOCX_TOPIC_ARN,
  AWS_REGION
} = process.env

module.exports = async ({ key, sub, id, name }) => {
  const sns = new AWS.SNS({ region: AWS_REGION })
  const url = sign({ key })
  return sns.publish({
    TopicArn: DOCX_TOPIC_ARN,
    Message: JSON.stringify({
      key: `${id}/${name}.pdf`,
      url: url,
      tags: { sub }
    })
  }).promise()
}
