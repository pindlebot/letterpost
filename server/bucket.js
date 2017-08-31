require("dotenv").config()
const AWS = require('aws-sdk')
var path = require('path')
var uuid = require('uuid/v4')

const awsS3Client = new AWS.S3({
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

var s3Stream = require("s3-upload-stream")(awsS3Client)

var key = uuid()

var upload = s3Stream.upload({
  Bucket: "printly",
  Key: `pdfs/${key}.pdf`
})

upload.maxPartSize(20971520)
upload.concurrentParts(5)

module.exports = upload
