const createPresignedURL = require('aws-presign')

module.exports.handler = async (event, context, callback) => {
  const url = createPresignedURL()
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ url }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}
