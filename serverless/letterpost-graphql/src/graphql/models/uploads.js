const { randomBytes } = require('crypto')
const db = require('dynamodb-tools')
const Orders = require('./orders')
const AWS = require('aws-sdk')
const querystring = require('query-string')
const aws4 = require('aws4')
const path = require('path')
const { ValidationError } = require('apollo-server-lambda')

const {
  DYNAMODB_PREFIX,
  AWS_BUCKET,
  AWS_REGION
} = process.env

const UPLOADS_TABLE = `${DYNAMODB_PREFIX}-uploads`
const mime = require('mime-types')

const s3 = new AWS.S3({
  region: AWS_REGION
})

const parseXAmzDate = (string) => {
  let date = [
    string.slice(0, 4),
    string.slice(4, 6),
    string.slice(6, 8)
  ].join('-')
  let time = [
    string.slice(8, 11),
    string.slice(11, 13),
    string.slice(13, 16)
  ].join(':')
  return (Date.parse(`${date}${time}`) / 1000)
}

const isExpired = (url) => {
  let parsed = querystring.parse(url)
  let expires = parsed['X-Amz-Expires']
  let date = parseXAmzDate(parsed['X-Amz-Date'])
  return (expires + date) > (Date.now() / 1000)
}

const update = (input) => db(UPLOADS_TABLE)
  .set({
    updatedAt: new Date().toISOString(),
    ...input
  })

async function remove ({ id, user }) {
  let orders = await Orders.get({ upload: id })
  if (orders && orders.length) {
    await Promise.all(
      orders.map(order => Orders.update({
        id: order.id,
        upload: null
      }))
    )
  }

  await db(UPLOADS_TABLE).remove({ id })
  return { id }
}

const VALID_FILE_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.text',
  '.md',
  '.markdown',
  '.html',
  '.doc',
  '.tex',
  '.docx'
]

async function create ({ size, name, type, user, orderId }) {
  let ext = path.extname(name)
  if (ext) {
    if (!VALID_FILE_EXTENSIONS.includes(ext)) {
      throw new ValidationError(`File extension ${ext} is not valid.`)
    }
  }
  let uploadId = randomBytes(5).toString('hex')
  await Orders.update({
    id: orderId,
    upload: uploadId
  })
  return update({
    id: uploadId,
    key: `${uploadId}/${name}`,
    createdAt: new Date().toISOString(),
    name,
    type,
    size,
    user
  })
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

const assetMiddleware = (upload) => {
  let basename = path.basename(upload.key, path.extname(upload.key))
  let thumbnail = sign({ key: `${upload.id}/thumbnail.jpg` })
  let file = sign({ key: `${upload.id}/${basename}.pdf` })
  return {
    ...upload,
    file,
    thumbnail
  }
}

const get = async args => {
  let data = await db(UPLOADS_TABLE).get(args)
  if (data) {
    if (Array.isArray(data)) {
      return data.map(assetMiddleware)
    }
    return assetMiddleware(data)
  }

  return data
}

function createTagSet (data) {
  const tags = Object.keys(data).map(key =>
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  ).join('')
  return `<Tagging><TagSet>${tags}</TagSet></Tagging>`
}

function createPresignedPost ({ user, key }) {
  const tagging = createTagSet({ sub: user })

  return new Promise((resolve, reject) => {
    s3.createPresignedPost({
      Bucket: AWS_BUCKET,
      Fields: {
        tagging: tagging,
        key: key
      }
    }, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

module.exports.createPresignedPost = createPresignedPost
module.exports.create = create
module.exports.remove = remove
module.exports.get = get
module.exports.update = update
module.exports.TABLE = UPLOADS_TABLE
