const { spawn } = require('child_process')

async function verify (file) {
  let child = spawn('/tmp/verapdf/verapdf', [file], { shell: true })
  let result = ''
  let resolveExecution
  let rejectExecution
  let promise = new Promise((resolve, reject) => {
    resolveExecution = resolve
    rejectExecution = reject
  })
  child.stdout.on('data', data => {
    let str = data.toString('utf8')
    console.log('data', str)
    result += str
  })
  child.stderr.on('data', data => {
    let str = data.toString('utf8')
    console.log('error', str)
  })
  child.on('close', () => resolveExecution(result))
  child.on('error', rejectExecution)

  return promise
}

module.exports = verify
