import mqtt from 'mqtt'
import 'isomorphic-fetch'
import { SESSION_UPLOAD_ENDPOINT } from './config'

const connect = ({ channel }) =>
  new Promise((resolve, reject) => channel.on('connect', resolve))

const subscribe = ({ channel, topic }) =>
  new Promise((resolve, reject) => channel.subscribe(topic,
    () => {
      console.log(`subscribed to topic "${topic}"`)
      resolve()
    })
  )

export const ID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export const sanitizeFileName = (name) => {
  let filename = name.replace(/[^A-Za-z-_.0-9]/g, '')
  return filename || Math.random().toString(36).substr(2, 9) // handle case where filename is all special characters, e.g., %%==^.pdf
}

export const remote = async ({ uploads }) => {
  const { url } = await fetch(SESSION_UPLOAD_ENDPOINT)
    .then(resp => resp.json())
  const channel = mqtt.connect(url)
  channel.on('error', error => console.log('WebSocket error', error))
  channel.on('offline', () => console.log('WebSocket offline'))
  channel.on('end', () => console.log('Websocket close'))
  channel.on('close', () => console.log('Websocket end'))
  await connect({ channel })
  await Promise.all(uploads.map(upload =>
    subscribe({ channel, topic: `letterpost/${upload}/pdf` })
  ))
  return channel
}

export const uploadDocument = async (file, filename, payload) => {
  const formData = new window.FormData()
  for (const field in payload.fields) {
    formData.append(field, payload.fields[field])
  }
  formData.append('file', file, filename)

  return fetch(payload.url, {
    method: 'POST',
    body: formData
  }).then(() => {
    window.URL.revokeObjectURL(file.preview)
  })
}

export const PATH_REGEX = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
