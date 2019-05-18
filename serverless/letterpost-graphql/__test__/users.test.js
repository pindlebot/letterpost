const DYNAMODB_TABLE = 'letterpost-api-prod'
process.env.AWS_REGION = 'us-east-1'
process.env.DYNAMODB_TABLE = DYNAMODB_TABLE
process.env.CLIENT_ID = '123'
process.env.CLIENT_SECRET = '456'
const db = require('dynamodb-tools')

const USERS_TABLE = `${DYNAMODB_TABLE}-users`
const ORDERS_TABLE = `${DYNAMODB_TABLE}-orders`
const CONTACTS_TABLE = `${DYNAMODB_TABLE}-contacts`
const ADDRESSES_TABLE = `${DYNAMODB_TABLE}-addresses`
const UPLOADS_TABLE = `${DYNAMODB_TABLE}-uploads`
// const users = require('../lib/graphql/dynamo/users')
// db.table(USERS_TABLE).get({ id: '460e682d-1c43-45a6-80ef-1fd3b4c5bed4' })
//  .then(data => {
//    console.log(data)
//  })

//users.createSession({ user: '123' })
//  .then(data => {
//    console.log(data)
//  })

// db.table(USERS_TABLE).get({
//  emailAddress: 'bgardner620@gmail.com'
//})//.then(({ Item }) => Item)
//  .then(console.log.bind(console))

// users.signinUser({
//  emailAddress: 'bgardner620@gmail.com',
//  password: 'Carbon14!'
// }).then(data => {
//  console.log(data)
// })

//db.table(CONTACTS_TABLE).get({ user: '2cca942c-e591-4a39-8c99-81994e089cdc' })
 // .then(data => {
 //   console.log(data)
 // })

const { request, GraphQLClient } = require('graphql-request')

// const get = args => db.table(ORDERS_TABLE)
//  .get(args)
//  .then(({ Item }) => Item)
//  .catch(() => ({}))

const endpoint = 'https://buv25gft77.execute-api.us-east-1.amazonaws.com/prod/graphql'

// get({id: "74183bb317"}).then(console.log.bind(console))
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTA2YjA1MThhIiwiaWF0IjoxNTMyNTg2NjUzLCJleHAiOjE1MzI2Mjk4NTMsImF1ZCI6InJMMXJiS29yajdoMWRZWEtwU3FLcFpyUHFFenMzcXVWIn0.H8utmeDAVypUWM5RGm_UTtWzCMXYdtrgp8MH45OqTuc'

// const client = new GraphQLClient(endpoint, {
//  headers: {
//    'Authorization': 'Bearer ' + TOKEN
//  }
//})

const query = `{
  user {
    id
    orders {
      id
      user {
        id
      }
    }
    contacts {
      id
    }
  }
}`
// client.request(query).then(data => console.log(JSON.stringify(data)))

// db.table(ORDERS_TABLE).get({
//  user: '8e06b0518a'
// }).then(data => {
//  console.log(data)
// })

// db(CONTACTS_TABLE).get({
//  user: '8e06b0518a'
//}).then(data => {
//  console.log(data)
//})
process.env.DEBUG = true
db(UPLOADS_TABLE).get({ user: '4d335a742a' }).then(console.log.bind(console))
