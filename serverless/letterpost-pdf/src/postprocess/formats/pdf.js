const AWS = require('aws-sdk')
const { sign } = require('../util')
const path = require('path')
const {
  AWS_REGION = 'us-east-1',
  GHOSTSCRIPT_TOPIC_ARN,
  PDF_THUMBNAIL_TOPIC_ARN
} = process.env

// const countPages = (file) => {
//  const command = `pdftk "${file}" dump_data | grep NumberOfPages | awk '{print $2}' | tr -dc '[0-9]'`
//  return new Promise((resolve, reject) => {
//    exec(command, (error, stdout, stderr) => {
//      if (error) reject(error)
//      else resolve(stdout)
//    })
//  }).then(out => Number(out.trim()))
// }

// const generateThumbnail = async (key) => {
//  let [id, name] = key.split('/')
//  let Body = new PassThrough()
// AWS.config.update({ region: AWS_REGION })
//  let upload = new AWS.S3.ManagedUpload({
//    tags: [{
//      Key: 'generated',
//      Value: true
//   }],
//   params: {
//     Body,
//     Bucket: AWS_BUCKET,
//     Key: `${id}/thumbnail.jpeg`,
//     ContentType: 'image/jpeg'
//   }
// })
//  const Canvas = require('canvas')
//  const canvas = Canvas.createCanvas(612, 792)
//  const ctx = canvas.getContext('2d')
//  const image = new Canvas.Image()
///  image.onload = function () {
//   ctx.drawImage(image, 0, 0, 612, 792)
//  }
//  image.src = await toBuffer(jpgStream)
//  canvas.createJPEGStream().pipe(Body)
//  upload.send()
// }

// const createReadStream = (key, { s3 }) => {
//  const params = {
//    Bucket: AWS_BUCKET,
//    Key: key
//  }
//  return s3.headObject(params)
//    .promise()
//    .then(() =>
//      s3.getObject(params).createReadStream()
//    )
// }

// const ENDPOINT = 'https://6eipgp781e.execute-api.us-east-1.amazonaws.com/dev/'

// const handler = async ({ id, name, ext, key, sub }) => {
//  const url = sign({ key })
//  let data
//  try {
//    data = await fetch(ENDPOINT, {
//      method: 'POST',
//      headers: {
//        'Content-type': 'application/json'
//      },
//      body: JSON.stringify({ url, key: `${id}/thumbnail.jpg`, sub })
//    }).then(resp => resp.json())
//  } catch (err) {
//    throw err
//  }
//  return data
// }

module.exports = async ({ id, name, ext, key, sub }) => {
  const sns = new AWS.SNS({ region: AWS_REGION })
  const file = sign({ key })
  const stats = {
    startTime: Date.now()
  }
  const steps = [
    process.env.AWS_LAMBDA_FUNCTION_NAME
  ]
  let data = await sns.publish({
    TopicArn: PDF_THUMBNAIL_TOPIC_ARN,
    Message: JSON.stringify({
      sub,
      key,
      file,
      id,
      topicArn: GHOSTSCRIPT_TOPIC_ARN,
      stats,
      objectKey: key,
      objectPrefix: path.dirname(key),
      steps
    })
  }).promise()
  return data
}
