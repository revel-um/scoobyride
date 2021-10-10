const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    middleName: String,
    lastName: String,
    profilePicture: String,
    age: Number,
    gender: String,
    latitude: String,
    longitude: String,
    address: String,
    phoneNumber: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('User', userSchema);