const scissors = require('scissors');
const path = require('path')
const fs = require('fs')
const debug = require('debug')('print-and-send')
let Duplex = require('stream').Duplex;  
const bucket = require('./bucket')
var compress = require('zlib').createGzip()
var lob = require('./lob')
const constants = require('./example')

function bufferToStream(buffer) {  
  let stream = new Duplex()
  stream.push(buffer)
  stream.push(null)
  return stream;
}

function merge(buff, ws) {
  bucket.on("error", function(error) {
    console.log(error);
  })

  bucket.on("part", function(details) {
    console.log(details);
  })

  bucket.on("uploaded", function(details) {
    debug(details)
    ws.send(JSON.stringify(details))
    //lob({ 
    //  file: details.Location,
    //  description: constants.description,
    //  to: constants.sender,
    //  from: constants.recipient
    //})
  })

  var stream = bufferToStream(buff)
  return new Promise((resolve, reject) => {
    scissors.join(
      scissors(path.join(__dirname, 'blank.pdf')),
      scissors(stream)
    )
    .pdfStream()
    .pipe(bucket)
    .on('finish', () => {
      debug('Done')
      resolve(true)
    }).on('error', (err) => {
      debug(err)
    })
  })
}

module.exports = merge