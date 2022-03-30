const mongoose = require('mongoose')
//State --> {0: Order received, 1: Being cooked, 2: Dispacted, 3: 'On way', 4: Delived}
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, state: Number }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

module.exports = mongoose.model('Order', orderSchema)