const fs = require('fs')
const { promisify } = require('util')
const unzipper = require('unzipper')
const stat = promisify(fs.stat)
const chmod = promisify(fs.chmod)
const got = require('got')

const isInstalled = async () => {
  let installed
  try {
    installed = await stat('/tmp/verapdf/verapdf')
  } catch (err) {
    installed = false
  }
  return installed
}

async function install () {
  const installed = await isInstalled()
  if (!installed) {
    const zip = unzipper.Extract({ path: '/tmp' })
    const stream = got.stream(process.env.VERAPDF_ZIP_URL)
    stream.pipe(zip)

    await new Promise((resolve, reject) => {
      zip.on('close', resolve)
    })
    await chmod('/tmp/verapdf/verapdf', '0700')
    await chmod('/tmp/verapdf/verapdf-gui', '0700')
    await chmod('/tmp/verapdf/bin/greenfield-apps-1.12.1.jar', '0700')
  }
}

module.exports = install
