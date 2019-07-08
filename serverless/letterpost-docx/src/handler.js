const path = require('path')
const fs = require('fs')
const { randomBytes } = require('crypto')
const url = require('url')
const https = require('https')

const convert = require('./convert')

const handleConvert = (json) => {
  const { pathname } = url.parse(json.url)
  const id = randomBytes(10).toString('hex')
  const docPath = path.join('/tmp', `${id}-${path.basename(pathname)}`)
  return new Promise(resolve => {
    https.get(json.url, async resp => {
      const writeStream = fs.createWriteStream(docPath)
      await new Promise((resolve, reject) => {
        resp.pipe(writeStream)
        writeStream.on('close', resolve)
        writeStream.on('error', reject)
      })
      resolve(convert(docPath, json))
    })
  })
}

function handleMessage (record) {
  const { Sns: { Message } } = record
  const message = JSON.parse(Message)
  return handleConvert(message)
}

module.exports.handler = async function (event, context) {
  const { Records } = event
  await Promise.all(Records.map(handleMessage))
}
