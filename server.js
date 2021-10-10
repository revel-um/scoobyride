const http = require('http')
const port = process.env.PORT
const app = require('./app')
console.log(port)
const server = http.createServer(app)
server.listen(port)