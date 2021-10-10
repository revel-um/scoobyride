const mongoose = require('mongoose')
const Store = require('../schemas/storeSchema')
const Product = require('../schemas/productSchema')
const fs = require('fs');


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.createStore = (req, res, next) => {
    let path = null;
    if (req.file !== undefined)
        path = process.env.BASE_URL + replaceAll(req.file.path, '\\\\', '/');

    const store = new Store({
        _id: mongoose.Types.ObjectId(),
        storeName: req.body.storeName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        creationDate: new Date(),
        subscriptionExpired: false,
        storeImage: path,
    })
    store.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "You have created a store successfuly",
            object: store,
        })
    }).catch(err => {
        console.log("err" + err)
        res.status(500).json({
            error: err
        })
    })
}

exports.getAllStores = (req, res, next) => {
    Store.find().exec().then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteStore = (req, res, next) => {
    const id = req.params.id

    Product.find({ store: id }).exec().then(result => {
        if (result.length > 0) {
            return res.status(400).json({
                message: 'There are ' + result.length + ' products left in your store. Delete them first to delete the store'
            })
        } else {
            let imageDeletion = false;
            Store.findById(id).exec().then(result => {
                const r = result.storeImage;
                Store.deleteOne({
                    _id: id
                }).exec().then(result => {
                    if (r != null) {
                        try {
                            const url = r.replace(process.env.BASE_URL, '');
                            fs.unlinkSync(url);
                            imageDeletion = 'Image deleted successfully';
                        } catch (e) {
                            imageDeletion = 'Image not found'
                        }
                    }
                    res.status(200).json({ message: result, imageDeletion: imageDeletion })
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
            }).catch(err => {
                res.status(404).json({ error: err })
            })
        }
    }).catch(err => {
        let imageDeletion = false;
        Store.findById(id).exec().then(result => {
            const r = result.storeImage;
            Store.deleteOne({
                _id: id
            }).exec().then(result => {
                if (r != null) {
                    try {
                        const url = r.replace(process.env.BASE_URL, '');
                        fs.unlinkSync(url);
                        imageDeletion = 'Image deleted successfully';
                    } catch (e) {
                        imageDeletion = 'Image not found'
                    }
                }
                res.status(200).json({ message: result, imageDeletion: imageDeletion })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        }).catch(err => {
            res.status(404).json({ error: err })
        })
    })
}

exports.updateStore = (req, res, next) => {
    const id = req.params.id
    const updateObj = {}
    let path = null;
    if (req.file !== undefined) {
        path = process.env.BASE_URL + replaceAll(req.file.path, '\\\\', '/');
        updateObj['storeImage'] = path;
    }
    for (const key of Object.keys(req.body)) {
        if (key != 'storeImage')
            updateObj[key] = req.body[key];
    }
    Store.updateOne({ _id: id }, { $set: updateObj }).exec().then(result => {
        res.status(200).json({
            message: "Update sucessful",
            updateObject: updateObj
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}