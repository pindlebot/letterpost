const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(path.join(__dirname, 'app/components'))

const alias = files.reduce((acc, c) => {
  acc[c] = `./app/components/${c}/index.js`
  return acc
}, {})

const babelrc = fs.readFileSync(path.join(__dirname, '.babelrc'), { encoding: 'utf8' })

const json = JSON.parse(babelrc)

const { plugins } = json

plugins.push(
  ['module-resolver', {
    root: ['.'],
    alias: alias
  }]
)

fs.writeFileSync(
  path.join(__dirname, '.babelrc'),
  JSON.stringify({
    ...json,
    plugins
  }, null, 2)
)
