const mongoose = require("mongoose");
const Order = require("../schemas/orderSchema");
const Product = require("../schemas/productSchema");

const stateStringToInt = {
    Cart: 0,
    "Order Confirmed": 1,
    "Order Complete": 2,
    Favourites: 3,
};

exports.addOrUpdateOrderState = (req, res, next) => {
    const id = req.userData.userId;
    Order.findOne({ user: req.userData.userId })
        .exec()
        .then((result) => {
            const productId = req.body.productId;
            const state = req.body.state;
            const store = req.body.store;
            Product.findById(productId)
                .exec()
                .then((resultOfProduct) => {
                    if (resultOfProduct == undefined)
                        return res.status(400).json({ message: "This productId is not valid" });
                    if (!state in stateStringToInt && state != "Delete")
                        return res
                            .status(400)
                            .json({
                                error:
                                    "This state is not valid, valid states are: " +
                                    Object.keys(stateStringToInt),
                            });
                    if (result == undefined) {
                        const orderObj = {};
                        orderObj["_id"] = mongoose.Types.ObjectId();
                        orderObj["user"] = id;
                        orderObj["items"] = {
                            product: productId,
                            state: stateStringToInt[state],
                            store: store,
                        };
                        const order = new Order(orderObj);
                        order.save().then((result) => {
                            res.status(200).json({
                                message: "Created successfully",
                                result: result,
                            });
                        });
                    } else {
                        const items = result.items;
                        let count = -1;
                        let newProductInOrder = true;
                        for (let item of items) {
                            count++;
                            if (item["product"].toString() == productId) {
                                newProductInOrder = false;
                                if (state == "Delete") {
                                    result.items.pop(count);
                                } else {
                                    result.items[count]["state"] = stateStringToInt[state];
                                    item["product"] = stateStringToInt[state];
                                    result.items[count]["store"] = store;
                                }
                            }
                        }
                        if (newProductInOrder) {
                            if (state == "Delete") {
                                return res
                                    .status(400)
                                    .json({ message: "Can not delete because it is not added" });
                            }
                            result.items.push({
                                product: mongoose.Types.ObjectId(productId),
                                state: stateStringToInt[state],
                                store: store
                            });
                        }
                        Order.updateOne({ _id: result._id }, { $set: { items: result.items } })
                            .exec()
                            .then((result) => {
                                return res.status(200).json({ result: result });
                            })
                            .catch((err) => {
                                return res.status(500).json({ error: err });
                            });
                    }
                });
        })
        .catch((err) => {
            return res.status(500).json({ message: "catch", err: err });
        });
};

exports.getMyOrders = (req, res, next) => {
    const userId = req.userData.userId;
    Order.findOne({ user: userId })
        .populate("items.product").populate('items.store')
        .exec()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).json({ error: err, message: "Error occured while getMyOrders" });
        });
};

exports.getOrderState = (req, res, next) => {
    const userId = req.userData.userId;
    Order.findOne({ user: userId })
        .populate("items.product").populate('items.store')
        .exec()
        .then((result) => {
            console.log(result);
            req.productStateDetails = result;
            next();
        })
        .catch((err) => {
            res.status(500).json({ error: err, message: "Error occured while getOrderState" });
        });
};
