const AWS = require('aws-sdk')
const { AWS_REGION } = process.env
const Orders = require('./orders')

const getOrdersByUploadId = ({ id }) => {
  let client = new AWS.DynamoDB.DocumentClient({
    region: AWS_REGION
  })
  return client.get({
    TableName: Orders.TABLE,
    ExpressionAttributeNames: {
      '#uploads': 'uploads'
    },
    ExpressionAttributeValues: {
      ':upload': id
    },
    ConditionExpression: 'contains(#uploads, :upload)'
  }).promise()
    .then(data => data.Items || [])
    .catch(() => ([]))
}

const associateUpload = ({ id, order }) => {
  return Orders.update({
    id: order,
    upload: id
  })
}

const dissociateUpload = ({ id, order }) => {
  return Orders.update({
    id: order,
    upload: null
  })
}

module.exports.associateUpload = associateUpload
module.exports.dissociateUpload = dissociateUpload
module.exports.getOrdersByUploadId = getOrdersByUploadId
