const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    model: { type: String, required: true },
    licencePlate: { type: String, required: true },
    rentPerHour: { type: String, required: true },
    rentPerDay: { type: String, required: true },
    productImages: { type: [String], default: [] },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', require: true },
    criteria: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    details: String,
    bullets: String,
    size: String,
    price: Number,
    discount: Number,
    isDiscountPercent: { type: Boolean, default: true },
    outOfStock: { type: Boolean, default: false }
})

module.exports = mongoose.model('Product', productSchema)