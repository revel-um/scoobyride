const mongoose = require('mongoose')

exports.createOrder = (req, res, next)=>{
    res.status(200).json({
        data: "Hey buddy"
    })
}