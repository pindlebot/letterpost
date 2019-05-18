const aws4 = require('aws4')
const mime = require('mime-types')
const { AWS_REGION = 'us-east-1', AWS_BUCKET = 'letterpost' } = process.env

const createTagSet = (data) => {
  const tags = Object.keys(data).map(key =>
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  )
  return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`
}

const createReadStream = (key, { s3 }) => {
  const params = {
    Bucket: AWS_BUCKET,
    Key: key
  }
  return s3.headObject(params)
    .promise()
    .then(() =>
      s3.getObject(params).createReadStream()
    )
}

const sign = ({ key }) => {
  let type = encodeURIComponent(mime.lookup(key))
  const host = 's3.amazonaws.com'
  const signed = aws4.sign({
    host: host,
    path: `/${AWS_BUCKET}/${key}?response-content-type=${type}&X-Amz-Expires=3600`,
    service: 's3',
    region: AWS_REGION,
    signQuery: true
  })
  return `https://${host}${signed.path}`
}

module.exports.createTagSet = createTagSet
module.exports.createReadStream = createReadStream
module.exports.sign = sign
