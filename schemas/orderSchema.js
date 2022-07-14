const mongoose = require("mongoose");
//State --> {0: 'Cart', 1: 'Order Confirmed', 2: 'Order Complete', 3: 'Favourites'}
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, state: Number, store:{type: mongoose.Schema.Types.ObjectId, ref: "Store"}, bookings: Map }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
});

module.exports = mongoose.model("Order", orderSchema);

// bookings: {18-04-2022: userId }