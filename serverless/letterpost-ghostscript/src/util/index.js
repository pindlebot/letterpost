const aws4 = require('aws4')
const mime = require('mime-types')
const fs = require('fs')
const { promisify } = require('util')
const stat = promisify(fs.stat)
const AWS = require('aws-sdk')
const got = require('got')

const { AWS_REGION = 'us-east-1', AWS_BUCKET = 'letterpost' } = process.env

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

const createUploadStream = async (objectPath, { key, tagging }) => {
  const s3 = new AWS.S3({ region: AWS_REGION || 'us-east-1' })
  try {
    await stat(objectPath)
  } catch (error) {
    throw error
  }
  const stream = fs.createReadStream(objectPath)
  const contentType = mime.lookup(objectPath)

  return s3.putObject({
    Body: stream,
    Bucket: AWS_BUCKET,
    Key: key,
    ContentType: contentType,
    Tagging: tagging || undefined
  }).promise()
}

const download = async ({ file, pdfPath }) => {
  let _resolve
  let _reject
  let promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  const writable = fs.createWriteStream(pdfPath)
  const stream = got.stream(file)
  stream.on('error', _reject)
  writable.on('close', _resolve)
  stream.pipe(writable)
  return promise
}

module.exports.download = download
module.exports.sign = sign
module.exports.createUploadStream = createUploadStream
module.exports.uploadThumbnail = require('./upload-thumbnail')
module.exports.countPages = require('./count-pages')
