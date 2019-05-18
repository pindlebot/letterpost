const launchChrome = require('@serverless-chrome/lambda')
const AWS = require('aws-sdk')
const CDP = require('chrome-remote-interface')

const upload = async (data, { key, contentType, tagging }) => {
  let s3 = new AWS.S3({ region: process.env.AWS_REGION })
  await s3
    .putObject({
      Bucket: 'letterpost',
      Key: key,
      ContentType: contentType || 'application/pdf',
      Body: Buffer.from(data, 'base64'),
      Tagging: tagging
    })
    .promise()
}

async function setHtml (client, html) {
  const { Page } = client

  const { frameTree: { frame: { id: frameId } } } = await Page.getResourceTree()
  await Page.setDocumentContent({ frameId, html })
}

async function connectToChrome () {
  const target = await CDP.New({
    port: 9222,
    host: 'localhost'
  })
  return CDP({ target, host: 'localhost', port: 9222 })
}

function pdf (client, options = {}) {
  const { Page } = client
  return Page.printToPDF(options)
    .then(({ data }) => data)
}

async function visit (client, url, waitTimeout = 5000) {
  const { Network, Page } = client
  await Promise.all([Network.enable(), Page.enable()])
  await Page.navigate({ url })
  await Page.loadEventFired()
}

async function screenshot (client) {
  const captureScreenshotOptions = {
    format: 'png',
    fromSurface: true,
    clip: undefined
  }
  const { Page } = client
  const screenshot = await Page.captureScreenshot(captureScreenshotOptions)
  return screenshot.data
}

module.exports.handler = async (event, context, callback) => {
  const { Records } = event
  let chrome = await launchChrome({
    flags: ['--window-size=1280x1696', '--hide-scrollbars']
  })
  const client = await connectToChrome()
  await Promise.all(
    Records.map(async record => {
      let { Sns: { Message } } = record
      let message = JSON.parse(Message)
      let data
      let contentType
      if (message.html) {
        await setHtml(client, message.html)
        data = await pdf(client)
        contentType = 'application/pdf'
      } else if (message.url) {
        await visit(client, message.url)
        data = await screenshot(client)
        contentType = 'image/png'
      }
      await upload(data, {
        key: message.key,
        contentType,
        tagging: `sub=${message.sub}`
      })
      return message.key
    })
  )
  await CDP.Close({
    host: 'localhost',
    port: 9222,
    id: client.target.id
  })
  chrome.kill()
  await client.close()
  callback(null, {})
}
