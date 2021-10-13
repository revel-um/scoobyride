const mongoose = require('mongoose')
//State --> {0: Order received, 1: Being cooked, 2: Dispacted, 3: 'On way', 4: Delived}
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, required: true },
    state: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
})

module.exports = mongoose.model('Order', orderSchema)