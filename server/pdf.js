var fs = require('fs')
var path = require('path')
var debug = require('debug')('pdf')
var Canvas = require('canvas')
var scissors = require('scissors');

var Image = Canvas.Image
var canvas = new Canvas(612, 792, 'pdf')
//var canvas = new Canvas (400, 500, 'pdf')
var ctx = canvas.getContext('2d')

function combine() {
  scissors.join(
    scissors(path.join(__dirname, 'blank.pdf')),
    scissors(path.join(__dirname, '1.pdf'))
  )
  .pdfStream()
  .pipe(fs.createWriteStream('out.pdf'))
  .on('finish', function(){
    console.log("We're done!");
  }).on('error',function(err){
    throw err;
  })
}

function h1 () {
  ctx.font = '36px Helvetica'
  ctx.fillText('Lorem', 100, 100)
}

function addPage() {
  h1()
  ctx.addPage()
}

function createPdf() {
  addPage()
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, './', '2.pdf'), 
      canvas.toBuffer(), 
      function (err) {
        if(err) debug(err)
    })
  })
}

createPdf()
//combine()