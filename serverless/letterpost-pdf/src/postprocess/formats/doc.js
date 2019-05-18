const fetch = require('node-fetch')
const { sign } = require('../util')
const {
  WORD_CONVERT_ENDPOINT
} = process.env

module.exports = ({ key, sub, id, name }) => {
  console.log('postprocess-doc', key)
  const endpoint = `${WORD_CONVERT_ENDPOINT}${encodeURIComponent(`${id}/${name}.pdf`)}`
  const url = sign({ key })
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ url, tags: { sub } })
  }).then(resp => resp.json())
}
