const arrayWalk = (source) => source.reduce((acc, value) => {
  if (
    ['string', 'number', 'boolean', 'undefined'].includes(typeof value) ||
    value === null
  ) {
    acc.push(value)
  } else if (typeof value === 'object') {
    let child = walk(value)
    acc.push(child)
  }

  return acc
}, [])

const objectWalk = source => Object.keys(source).reduce((acc, key) => {
  let value = Array.isArray(source[key]) && source[key].length === 1
    ? source[key][0] : source[key]

  if (key === '$') {
    acc = { ...acc, ...value }
  } else if (
    ['string', 'number', 'boolean', 'undefined'].includes(typeof value) ||
    value === null
  ) {
    acc[key] = value
  } else if (typeof value === 'object') {
    let child = walk(value)
    acc[key] = child
  }

  return acc
}, {})

const walk = (source) => Array.isArray(source)
  ? arrayWalk(source)
  : objectWalk(source)

module.exports = walk
