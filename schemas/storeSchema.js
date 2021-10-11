const mongoose = require('mongoose')

const storeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    storeName: { type: String, required: true },
    storeImage: String,
    pinCode: {type: Number, required: true},
    city: {type: String, required: true},
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    searchQuery: String,
    creationDate: { type: Date, required: true },
    subscriptionExpired: { type: Boolean, required: true },
    openHours: { type: [String], default: ["08:00", "08:00", "08:00", "08:00", "08:00", "08:00", "08:00",] },
    closeHours: { type: [String], default: ["08:00", "08:00", "08:00", "08:00", "08:00", "08:00", "08:00",] },
})

module.exports = mongoose.model('Store', storeSchema)