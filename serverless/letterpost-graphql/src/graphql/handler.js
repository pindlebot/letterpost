const server = require('./server')

module.exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
})
