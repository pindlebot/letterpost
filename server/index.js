const {
  wss,
  nextApp,
  app,
  server} = require('./init')

const nextHandler = nextApp.getRequestHandler();  
const port = parseInt(process.env.PORT, 10) || 3000;

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  })

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  })
})