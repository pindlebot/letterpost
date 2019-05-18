const { createNonce } = require('./util')
const AWS = require('aws-sdk')
const { SES_TOPIC_ARN, AWS_REGION, AWS_ACCOUNT_ID } = process.env

const sns = new AWS.SNS({ region: AWS_REGION })
const ses = new AWS.SES({ region: AWS_REGION })

const sendUserConfirmationEmail = async (user) => {
  const nonce = await createNonce(user)
  return sns.publish({
    Message: JSON.stringify({
      emailAddress: user.emailAddress,
      variables: {
        href: nonce
      },
      templateType: 'confirmation'
    }),
    TopicArn: SES_TOPIC_ARN
  }).promise()
}

const sendOrderConfirmationEmail = (user) => {
  return sns.publish({
    Message: JSON.stringify({
      emailAddress: user.emailAddress,
      variables: {
        href: 'https://letterpost.co/account'
      },
      templateType: 'order'
    }),
    TopicArn: SES_TOPIC_ARN
  }).promise()
}

const sendEmail = ({
  toAddresses,
  fromAddress,
  subject,
  html,
  text
}) => {
  const SourceArn = `arn:aws:ses:${AWS_REGION}:${AWS_ACCOUNT_ID}:identity/${fromAddress}`
  return ses.sendEmail({
    Destination: {
      ToAddresses: toAddresses
    },
    Message: {
      Body: {
        Html: {
          Data: html || text,
          Charset: 'utf8'
        },
        Text: {
          Data: text || '',
          Charset: 'utf8'
        }
      },
      Subject: {
        Data: subject,
        Charset: 'utf8'
      }
    },
    Source: fromAddress,
    ReplyToAddresses: [
      fromAddress
    ],
    SourceArn: SourceArn
  }).promise()
    .catch(err => {
      throw err
    })
}

module.exports.sendUserConfirmationEmail = sendUserConfirmationEmail
module.exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail
module.exports.sendEmail = sendEmail
