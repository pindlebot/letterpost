const { PassThrough } = require('stream')
const fs = require('fs')
const AWS = require('aws-sdk')
const { exec } = require('child_process')
const { getExecutablePath } = require('@shelf/aws-lambda-libreoffice')

const {
  AWS_REGION = 'us-east-1',
  AWS_BUCKET = 'letterpost',
  LIBRE_OFFICE_TMP_DIR = '/tmp'
} = process.env

const path = require('path')

const command = (executablePath, filename) =>
  `${executablePath} --headless --convert-to pdf:writer_pdf_Export "${filename}" --outdir ${LIBRE_OFFICE_TMP_DIR}`

module.exports = async (documentPath, { tags, key }) => {
  const executablePath = await getExecutablePath()
  let basename = path.basename(documentPath, path.extname(documentPath))
  try {
    await new Promise((resolve, reject) => {
      exec(command(executablePath, documentPath), (err, stdout, stderr) => {
        if (err) reject(err)
        else resolve(true)
      })
    })
  } catch (err) {
    throw err
  }

  const pdfPath = path.join(path.dirname(documentPath), `${basename}.pdf`)

  const pass = new PassThrough()
  AWS.config.update({ region: AWS_REGION })
  const managedUpload = new AWS.S3.ManagedUpload({
    tags: Object.keys(tags || {}).map(key => ({
      Key: key,
      Value: tags[key]
    })),
    params: {
      Body: pass,
      Bucket: AWS_BUCKET,
      Key: key,
      ContentType: 'application/pdf'
    }
  })
  managedUpload.send()
  const readStream = fs.createReadStream(pdfPath)
  readStream.on('error', console.error.bind(console))
  readStream.pipe(pass)

  try {
    await managedUpload.promise()
  } catch (err) {
    throw err
  }

  await new Promise((resolve, reject) => fs.unlink(documentPath, resolve))
  await new Promise((resolve, reject) => fs.unlink(pdfPath, resolve))
}
