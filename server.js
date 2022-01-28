// const http = require('http')
// console.log('http worked')
const express = require('express')
const port = 3000
// const app = require('./app')
const app = express();
app.listen(port, ()=>{
    console.log('listing to calls');
})
// console.log(port)
// const server = http.createServer(app)
// server.listen(port)