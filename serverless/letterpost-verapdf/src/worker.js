const got = require('got')
const xml2js = require('xml2js')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const parseXml = promisify(xml2js.parseString)
const walk = require('./util/walk')
const install = require('./util/install')
const AWS = require('aws-sdk')
const download = require('./util/download')
const verify = require('./util/verify')
const sns = new AWS.SNS({ region: 'us-east-1' })
const { AWS_LAMBDA_FUNCTION_NAME } = process.env

const handleError = (error, { webhook, topicArn }) => {
  if (topicArn) {
    return sns.publish({
      TopicArn: topicArn,
      Message: JSON.stringify({ message: error.toString() })
    }).promise()
  } else if (webhook) {
    return got(webhook, {
      json: true,
      body: {
        message: error.toString()
      }
    })
  }
}

const handleMessage = async ({ topicArn, webhook, ...rest }) => {
  const { file } = rest
  let id = randomBytes(10).toString('hex')
  let pdfPath = `/tmp/${id}.pdf`
  let errors = rest.errors || []
  let steps = rest.steps || []
  steps.push(process.env.AWS_LAMBDA_FUNCTION_NAME)

  try {
    await download({ file, pdfPath })
  } catch (error) {
    errors.push({ message: error.toString(), arn: AWS_LAMBDA_FUNCTION_NAME })
  }
  let verificationResultsXml
  try {
    verificationResultsXml = await verify(pdfPath)
  } catch (error) {
    errors.push({ message: error.toString(), arn: AWS_LAMBDA_FUNCTION_NAME })
  }

  let validationResults
  try {
    validationResults = await parseXml(verificationResultsXml)
  } catch (error) {
    errors.push({ message: error.toString(), arn: AWS_LAMBDA_FUNCTION_NAME })
  }

  let [data] = walk(validationResults.report.jobs)
  let message = {
    ...rest,
    job: data.job,
    errors,
    steps
  }
  return topicArn
    ? sns.publish({ Message: JSON.stringify(message), TopicArn: topicArn }).promise()
    : got(webhook, { json: true, body: message })
}

module.exports.handler = async (event, context, callback) => {
  const { Records } = event
  await install()
  await Promise.all(
    Records.map(record => {
      let { Sns: { Message } } = record
      let message = JSON.parse(Message)
      return handleMessage(message)
    })
  )
  callback(null, {})
}
