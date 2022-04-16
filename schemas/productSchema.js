const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    model: { type: String, required: true },
    licencePlate: { type: String },
    rentPerHour: { type: String },
    rentPerDay: { type: String, required: true },
    productImages: { type: [String], default: [] },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', require: true },
    criteria: { type: String, required: true },
    details: String,
    bullets: String,
    discount: Number,
    ratings: {type: Number, default: 0},
    ratedBy: {type: Number, default: 0},
    isDiscountPercent: { type: Boolean, default: true },
    booked: { type: Boolean, default: false }
})

module.exports = mongoose.model('Product', productSchema)