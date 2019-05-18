import 'isomorphic-fetch'
import jwt from 'jsonwebtoken'
import { parse } from 'query-string'
import gql from 'graphql-tag'
import { SESSION_TOKEN_ENDPOINT } from './config'

function testToken ({ client }) {
  return client.query({
    query: gql`
      query {
        user {
          id
        }
      }
    `
  }).catch(() => {
    window.localStorage.removeItem('token')
    return false
  }).then(() => {
    return true
  })
}

export default async function auth ({ client }) {
  let parsed = parse(window.location.search)
  if (parsed.nonce) {
    window.localStorage.setItem('token', parsed.nonce)
  }
  let token = window.localStorage.getItem('token')
  let payload = {}
  if (token) {
    let decoded
    try {
      decoded = jwt.decode(token)
    } catch (err) {
      window.localStorage.removeItem('token')
    }
    if (decoded) {
      if (decoded.exp < Date.now() / 1000) {
        let isOk = await testToken({ client })
        if (isOk) return
      }
      payload.token = token
    }
  }
  const resp = await fetch(SESSION_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const json = await resp.json()

  if (json.token !== payload.token) {
    window.localStorage.setItem('token', json.token)
  }

  return client.resetStore().then(() => json)
}
