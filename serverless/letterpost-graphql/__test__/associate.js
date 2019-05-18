const AWS = require('aws-sdk')

const associateUpload = async ({ upload, order }) => {
  let client = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
  await client.update({
    TableName: 'letterpost-api-prod-orders',
    Key: { id: order },
    UpdateExpression: 'SET #uploads = list_append(#uploads, :uploads)',
    ExpressionAttributeNames: {
      '#uploads': 'uploads'
    },
    ExpressionAttributeValues: {
      ':uploads': [upload],
      ':upload': upload
    },
    ConditionExpression: 'not contains(#uploads, :upload)'
  }).promise()
  return client.update({
    Key: { id: upload },
    TableName: Uploads.TABLE,
    UpdateExpression: 'SET #orders = list_append(#orders, :orders)',
    ExpressionAttributeNames: {
      '#orders': 'orders'
    },
    ExpressionAttributeValues: {
      ':orders': [order],
      ':order': order
    },
    ConditionExpression: 'not contains(#orders, :order)'
  }).promise()
}

const dissociateUpload = async ({ upload, order }) => {
  let client = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
  await client.update({
    TableName: 'letterpost-api-prod-orders',
    Key: { id: order },
    UpdateExpression: 'SET #uploads = list_append(#uploads, :uploads)',
    ExpressionAttributeNames: {
      '#uploads': 'uploads'
    },
    ExpressionAttributeValues: {
      ':uploads': [upload],
      ':upload': upload
    },
    ConditionExpression: 'not contains(#uploads, :upload)'
  }).promise()
  return client.update({
    Key: { id: upload },
    TableName: Uploads.TABLE,
    UpdateExpression: 'SET #orders = list_append(#orders, :orders)',
    ExpressionAttributeNames: {
      '#orders': 'orders'
    },
    ExpressionAttributeValues: {
      ':orders': [order],
      ':order': order
    },
    ConditionExpression: 'not contains(#orders, :order)'
  }).promise()
}

associateUpload({
  upload: '340de3172a',
  order: 'ce4d146b6c'
}).then(console.log.bind(console))
  .catch(console.log.bind(console))