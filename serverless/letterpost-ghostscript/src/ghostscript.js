const { exec } = require('child_process')
const commands = require('./commands.json')

module.exports = (operation, params) => {
  const command = Object.keys(params).reduce((acc, key) => {
    let value = params[key]
    if (typeof value !== 'string') {
      return acc
    }
    let re = new RegExp(`\\\${\\s*${key}\\s*}`, 'g')
    return re.test(acc) ? acc.replace(re, value) : acc
  }, commands[operation])
  return new Promise((resolve, reject) => {
    console.log(command)
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  })
}
