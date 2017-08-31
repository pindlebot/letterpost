require('dotenv').config()
const app = require("express")();
const next = require("next");
const server = require("http").createServer(app);
const debug = require('debug')
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const bodyParser = require('body-parser')
const merge = require('./merge')

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping("", false, true);
  });
}, 5000);

function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", function(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('message', async data => {
    console.log(data)
    merge(data, ws)
  })
})

app.use(bodyParser.json())

module.exports = {
  wss,
  nextApp,
  app,
  server,
}