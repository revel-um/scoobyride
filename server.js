const http = require('http')
const port = process.env.port
const app = require('./app')
console.log(port)
const server = http.createServer(app)
server.listen(port)