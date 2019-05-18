const ImageCanvas = require('../src/postprocess/formats/image/ImageCanvas')

const fs = require('fs')
const { promisify } = require('util')
const read = promisify(fs.readFile)
const path = require('path')

async function test () {
  let buffer = await read(path.join(__dirname, 'assets/logo.png'))
  let imageCanvas = new ImageCanvas(buffer, { debug: true })
  await imageCanvas.draw()
  let writeStream = fs.createWriteStream(path.join(__dirname, 'assets/logo.pdf'))
  imageCanvas.canvas.pdfStream().pipe(writeStream)
  writeStream.on('error', console.log.bind(console))
  writeStream.on('close', () => {
    console.log('close')
  })
}

test()