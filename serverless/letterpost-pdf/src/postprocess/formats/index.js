const image = require('./image')
const doc = require('./doc')
const markdown = require('./markdown')
const pdf = require('./pdf')
const html = require('./html')

module.exports = {
  doc: doc,
  docx: doc,
  md: markdown,
  markdown: markdown,
  pdf: pdf,
  html: html,
  jpg: image,
  png: image,
  jpeg: image
}
