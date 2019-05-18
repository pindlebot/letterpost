// process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/lib`

const AWS = require('aws-sdk')
const path = require('path')
const processImage = require('./formats/image')
const processDoc = require('./formats/doc')
const processPdf = require('./formats/pdf')
const processHtml = require('./formats/html')
const processMarkdown = require('./formats/markdown')

const version = require('pdftk-lambda').version
const {
  AWS_BUCKET,
  AWS_REGION = 'us-east-1'
} = process.env

const s3 = new AWS.S3({ region: AWS_REGION })

async function getS3ObjectTags ({ key }) {
  const data = await s3.getObjectTagging({
    Key: key,
    Bucket: AWS_BUCKET
  }).promise()
    .catch(err => {
      console.log(err)
    })
    .then(data => {
      console.log(data)
      return data
    })
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

  let tags = await getS3ObjectTags({ key })
  console.log(tags)
  let { sub, resized, skipProcessing } = tags
  if (resized || skipProcessing) {
    return cb(null, {})
  }
  let params = {
    key,
    sub: tags.sub || undefined,
    ext: parsed.ext,
    name: parsed.name,
    id: parsed.dir
  }
  switch (parsed.ext) {
    case '.pdf':
      await processPdf(params, sub)
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
      break
    case '.png':
    case '.jpg':
    case '.jpeg':
      await processImage(params, sub)
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
      break
    case '.doc':
    case '.docx':
      await processDoc(params, sub)
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
      break
    case '.html':
      await processHtml(params, sub)
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
      break
    case '.md':
    case '.markdown':
      await processMarkdown(params, sub)
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
      break
    default:
      console.log('No match.')
  }
}
