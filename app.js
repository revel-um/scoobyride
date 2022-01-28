const express = require('express')
const store = require('./routes/store')
const product = require('./routes/product')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const verification = require('./routes/verification')
const user = require('./routes/user')
const order = require('./routes/order')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/images', express.static('images'))

const connectDB = async () => { await mongoose.connect('mongodb+srv://utsav:utsav@cluster0.j7ebq.mongodb.net/Madhuram?retryWrites=true&w=majority') }
connectDB();


app.use('/verification', verification)
app.use('/stores', store)
app.use('/products', product)
app.use('/users', user)
app.use('/orders', order)


app.use('/', (req, res, next) => {
    const error = Error("Not found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app