const Canvas = require('canvas')

class ImageCanvas {
  constructor (buffer, { debug } = {}) {
    this.pageWidth = 612
    this.pageHeight = 792
    this.canvas = Canvas.createCanvas(this.pageWidth, this.pageHeight, 'pdf')
    this.image = new Canvas.Image()
    this.context = this.canvas.getContext('2d')
    this.buffer = buffer
    this.debug = debug || false
  }

  async load () {
    await new Promise((resolve, reject) => {
      this.image.onload = resolve
      this.image.src = this.buffer
    })
  }

  drawImage (sx, sy, sWidth, sHeight, dWidth, dHeight) {
    this.context.drawImage(
      this.image,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      dWidth,
      dHeight
    )
    this.context.addPage()
  }

  async draw () {
    await this.load()
    let sx = 0
    let sy = 0
    let pages = 1
    let sWidth = this.image.width
    let sHeight = this.image.height
    let dWidth = Math.min(this.image.width, this.pageWidth)
    let dHeight = Math.min(this.image.height, this.pageHeight)
    let imageAspectRatio = this.image.width / this.image.height
    let shouldTileHorizontally = imageAspectRatio > 1 && this.image.width > this.pageWidth
    let shouldTileVertically = imageAspectRatio < 1 && this.image.height > this.pageHeight

    if (shouldTileHorizontally) {
      sWidth = (dWidth / dHeight) * sHeight
      pages = Math.ceil(this.image.width / sWidth)
    }

    if (shouldTileVertically) {
      sHeight = sWidth / (dWidth / dHeight)
      pages = Math.ceil(this.image.height / sHeight)
    }

    let index = 0
    while (index < pages) {
      this.drawImage(
        sx,
        sy,
        sWidth,
        sHeight,
        dWidth,
        dHeight
      )
      index++
      if (shouldTileHorizontally) {
        sx += (sHeight * (dWidth / dHeight))
        let totalWidthConsumedAfterNextIteration = sWidth * (index + 1)
        if (totalWidthConsumedAfterNextIteration > this.image.width) {
          sWidth = ((this.image.width / sWidth) - index) * sWidth
        }
      }

      if (shouldTileVertically) {
        sy += ((sWidth * dHeight) / dWidth)
      }
    }
  }
}

module.exports = ImageCanvas
