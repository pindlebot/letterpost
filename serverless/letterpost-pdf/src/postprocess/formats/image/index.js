
const AWS = require('aws-sdk')
const { PassThrough } = require('stream')
const { AWS_BUCKET, AWS_REGION = 'us-east-1' } = process.env
const path = require('path')

const upload = (canvas, { sub, objectKey }) => {
  let Body = new PassThrough()
  let upload = new AWS.S3.ManagedUpload({
    tags: [{
      Key: 'sub',
      Value: sub
    }],
    params: {
      Body,
      Bucket: AWS_BUCKET,
      Key: objectKey,
      ContentType: 'application/pdf'
    }
  })
  canvas.pdfStream().pipe(Body)
  upload.send()
  return upload.promise()
}

// { id, name, ext, key, sub }
module.exports = async (params) => {
  let { key: objectKey, sub } = params
  let { dir: objectPrefix, name: objectName } = path.parse(objectKey)
  let s3 = new AWS.S3({ region: AWS_REGION })
  let buffer = await s3.getObject({
    Key: objectKey,
    Bucket: AWS_BUCKET
  }).promise()
    .then(data => data.Body)
  const ImageCanvas = require('./ImageCanvas')
  const imageCanvas = new ImageCanvas(buffer)
  await imageCanvas.draw()

  return upload(imageCanvas.canvas, {
    sub,
    objectKey: `${objectPrefix}/${objectName}.pdf`
  })
}
