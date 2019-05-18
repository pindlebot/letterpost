const got = require('got')
const fs = require('fs')

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

module.exports = download
