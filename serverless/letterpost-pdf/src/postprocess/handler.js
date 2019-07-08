const AWS = require('aws-sdk')
const path = require('path')
const processDocument = require('./formats')

const version = require('pdftk-lambda').version

const {
  AWS_BUCKET,
  AWS_REGION = 'us-east-1'
} = process.env

const s3 = new AWS.S3({ region: AWS_REGION })

async function getS3ObjectTags ({ key }) {
  let data
  try {
    data = await s3.getObjectTagging({
      Key: key,
      Bucket: AWS_BUCKET
    }).promise()
  } catch (err) {
    console.error(err)
    return {}
  }

  return data.TagSet.reduce((acc, { Key, Value }) => {
    acc[Key] = Value
    return acc
  }, {})
}

module.exports.handler = async function (event, ctx, cb) {
  if (!(event.Records && event.Records.length)) {
    return cb(null, {})
  }
  let record = event.Records[0]
  const key = decodeURIComponent(record.s3.object.key)
  const parsed = path.parse(key)
  if (/thumbnail/.test(parsed.name)) {
    return cb(null, {})
  }

  const tags = await getS3ObjectTags({ key })
  const { sub, resized, skipProcessing } = tags
  if (resized || skipProcessing) {
    return cb(null, {})
  }
  const params = {
    key,
    sub: tags.sub || undefined,
    ext: parsed.ext,
    name: parsed.name,
    id: parsed.dir
  }

  const ext = parsed.ext.slice(1)
  let data
  if (processDocument[ext]) {
    try {
      data = await processDocument[ext](params, sub)
    } catch (err) {
      console.error(err)
      cb(err, null)
    }
  }

  cb(null, data)
}
