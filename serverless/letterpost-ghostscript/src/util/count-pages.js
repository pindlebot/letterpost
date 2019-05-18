const ghostscript = require('../ghostscript')

const countPages = ({ pdfPath }, errors) =>
  ghostscript('count', { source: pdfPath })
    .then(({ stdout, stderr }) => {
      let data = {}
      if (stdout) {
        data.pages = parseInt(stdout.split(/\r?\n/g)[0])
      } else {
        data.error = stderr
      }
      return data
    })
    .catch(error => {
      errors.push({ message: error.toString() })
    })

module.exports = countPages
