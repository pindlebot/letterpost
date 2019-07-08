const AWS = require('aws-sdk')
const path = require('path')
const ghostscript = require('./ghostscript')
const { createUploadStream, download } = require('./util')

const { AWS_REGION } = process.env

const format = stdout => stdout.split(/\r?\n/g)
  .filter(v => /MediaBox/.test(v))
  .map(v => v.match(/(?<=\[\s*)([\d.]+)(?:\s?)([\d.]+)(?=\s?\])/gm)[0])
  .map(l => l.split(/\s+/g).map(val => parseInt(val)))

const getDimensions = async ({ pdfPath }) => {
  let { stdout } = await ghostscript('dimensions', { source: pdfPath })
  return format(stdout)
}

const resize = ({ pdfPath, resizedPdfPath }) =>
  ghostscript('resize', {
    source: pdfPath,
    dest: resizedPdfPath
  })

const comply = ({ pdfPath, compliantPdfPath }) =>
  ghostscript('comply', {
    source: pdfPath,
    dest: compliantPdfPath
  })

const uploadCompliantPdf = async (state, errors) => {
  try {
    let { name: objectName, dir: objectPrefix } = path.parse(state.objectKey)
    let compliantPdfPath = `/tmp/${objectPrefix}-pdfa-compliant.pdf`
    await comply({
      pdfPath: state.pdfPath,
      compliantPdfPath
    })
    state.pdfPath = compliantPdfPath
    state.objectKey = `${objectPrefix}/${objectName}-pdfa-compliant.pdf`
    await createUploadStream(state.pdfPath, {
      key: state.objectKey,
      tagging: `skipProcessing=true&sub=${state.sub}&compliant=true`
    })
  } catch (error) {
    errors.push({ message: error.toString() })
  }
}

const uploadResizedPdf = async (state, errors) => {
  try {
    await resize(state)
    state.pdfPath = `/tmp/${state.objectPrefix}-612x792.pdf`
    state.objectKey = `${state.objectPrefix}/${path.parse(state.objectKey).name}-612x792.pdf`
    await createUploadStream(state.pdfPath, {
      key: state.objectKey,
      tagging: `skipProcessing=true&sub=${state.sub}`
    })
  } catch (error) {
    console.log('resize', error)
    errors.push({ message: error.toString() })
  }
}

const handleMessage = async ({ job, ...rest }) => {
  let { file, key: objectKey, sub } = rest
  const objectPrefix = path.dirname(objectKey)
  const state = {
    file: file,
    pdfPath: `/tmp/${objectPrefix}.pdf`,
    thumbnailPath: `/tmp/${objectPrefix}.jpg`,
    resizedPdfPath: `/tmp/${objectPrefix}-612x792.pdf`,
    sub,
    objectKey,
    objectPrefix
  }
  await download(state)
  let failedRules = job && job.validationReport && job.validationReport.details && job.validationReport.details.failedRules
  let failedValidation = failedRules && parseInt(failedRules) > 6
  let errors = rest.errors && Array.isArray(rest.errors) ? rest.errors : []
  // let data = await countPages(state, errors)

  if (failedValidation) {
    await uploadCompliantPdf(state, errors)
  }

  let dimensions = await getDimensions(state)
    .catch(error => {
      errors.push({ message: error.toString() })
    })

  let resized = dimensions.some(([x, y]) => x !== 612 || y !== 792)
  if (resized) {
    await uploadResizedPdf(state, errors)
  }

  // await createAndUploadThumbnail(state, errors)
  return {
    ...rest,
    resized,
    objectPrefix,
    objectKey: state.objectKey,
    key: state.objectKey,
    errors
  }
}

const sns = new AWS.SNS({ region: AWS_REGION })

const publish = (data) => {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: process.env.WRAPUP_TOPIC_ARN
  }
  return sns.publish(params).promise()
}

module.exports.handler = async (event, context, callback) => {
  const { Records } = event
  await Promise.all(
    Records.map(async record => {
      let { Sns: { Message } } = record
      let message = JSON.parse(Message)
      let result = await handleMessage(message)
      if (result.objectKey !== message.objectKey) {
        await publish(result)
      }
    })
  )
  callback(null, {})
}
