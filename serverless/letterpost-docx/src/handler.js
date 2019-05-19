const path = require('path')
const fs = require('fs')
const { randomBytes } = require('crypto')
const convert = require('./convert')
const url = require('url')
const https = require('https')

const handleConvert = (json) => {
  let { pathname } = url.parse(json.url)
  let id = randomBytes(10).toString('hex')
  let docPath = path.join('/tmp', `${id}-${path.basename(pathname)}`)
  return new Promise(resolve => {
    https.get(json.url, async resp => {
      let writeStream = fs.createWriteStream(docPath)
      await new Promise((resolve, reject) => {
        resp.pipe(writeStream)
        writeStream.on('close', resolve)
        writeStream.on('error', reject)
      })
      resolve(convert(docPath, json))
    })
  })
}

const handleMessage = async (record) => {
  let { Sns: { Message } } = record
  let message = JSON.parse(Message)
  console.log({ message })
  return handleConvert(message)
}

module.exports.handler = async (event, context) => {
  const { Records } = event
  await Promise.all(Records.map(handleMessage))
}
