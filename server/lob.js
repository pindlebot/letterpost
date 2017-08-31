const debug = require('debug')('print-and-send')
var Lob = require("lob")(process.env.LOB_TEST_API_KEY);

function create({
  to,
  from,
  file,
  description,
  color = true,
}) {
  return new Promise((resolve, reject) => {
    Lob.letters.create({
      description,
      to,
      from,
      file,
      color
    },
    (err, res) => {
      if(err) debug(err)
      debug(res)
      resolve(res)
    })
  })
}

module.exports = create