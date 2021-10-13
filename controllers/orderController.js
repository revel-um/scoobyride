const mongoose = require('mongoose')
const Order = require('../schemas/orderSchema')

exports.placeOrder = (req, res, next) => {
    const orderObj = {}
    for (const key of Object.keys(req.body)) {
        orderObj[key] = req.body[key]
    }
    orderObj['_id'] = mongoose.Types.ObjectId();
    orderObj['orderDate'] = new Date()
    const order = new Order(orderObj);
    order.save().then(result => {
        res.status(200).json({ message: 'Order placed successfully' })
    })
}

exports.getUnpreparedOrders = (req, res, next) => {
    const storeId = req.query.storeId;
    Order.find({ store: storeId, state: 0 }).populate('product').exec().then(result => {
        res.status(200).json({ data: result })
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}

exports.getActiveOrders = (req, res, next) => {
    const userId = req.query.userId;
    Order.find({ user: userId, state: { $ne: 4 } }).populate('product').exec().then(result => {
        res.status(200).json({ data: result })
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}

exports.getOrderHistory = (req, res, next) => {
    Order.find({ user: userId, state: 4 }).populate('product').exec().then(result => {
        res.status(200).json({ data: result })
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}