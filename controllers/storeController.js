const mongoose = require('mongoose')
const Store = require('../schemas/storeSchema')
const Product = require('../schemas/productSchema')
const imageController = require('../controllers/imageController')

exports.createStore = (req, res, next) => {
    const storeObj = {}

    if (req.file !== undefined) {
        storeObj['storeImage'] = req.file.location
    }

    for (const key of Object.keys(req.body)) {
        storeObj[key] = req.body[key]
    }

    storeObj['_id'] = mongoose.Types.ObjectId();
    storeObj['creationDate'] = new Date();
    storeObj['subscriptionExpired'] = false;

    const store = new Store(storeObj);
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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

exports.getAllStores = (req, res, next) => {
    const km = req.query.km;
    const lat0 = req.query.latitude;
    const lon0 = req.query.longitude;
    const city = req.query.city;

    if ((km == null || lat0 == null || lon0 == null) && city != null) {
        return Store.find({ city: city }).exec().then(result => {
            res.status(200).json({
                data: result
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
        return;
    }
    else {
        if ((city == null) && (km != null && lat0 != null && lon0 != null)) {
            return Store.find().exec().then(result => {
                returnObj = []
                for (const r of result) {
                    const lat = r.latitude;
                    const lon = r.longitude;
                    const distance = getDistanceFromLatLonInKm(lat0, lon0, lat, lon)
                    if (distance < km) {
                        returnObj.push(r)
                    }
                }
                res.status(200).json({ data: returnObj })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        } if ((city != null) && (km != null && lat0 != null && lon0 != null)) {
            return Store.find({ city: city }).exec().then(result => {
                returnObj = []
                for (const r of result) {
                    const lat = r.latitude;
                    const lon = r.longitude;
                    const distance = getDistanceFromLatLonInKm(lat0, lon0, lat, lon)
                    if (distance < km) {
                        returnObj.push(r)
                    }
                }
                res.status(200).json({ data: returnObj })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        }
    }
    return res.status(400).json({
        error: 'Permeter not sufficient to find stores'
    });
}

exports.getStoreByPhone = (req, res, next) => {
    const phone = req.userData.phoneNumber;
    Store.find({ phoneNumber: phone }).exec().then(result => {
        res.status(200).json({ data: result });
    }).catch(err => res.status(500).json({
        error: err
    }));
}

exports.getStoreById = (req, res, next) => {
    const id = req.query.storeId;
    Store.findById(id).exec().then(result => {
        res.status(200).json({ data: result });
    }).catch(err => res.status(500).json({
        error: err
    }));
}

const isSubsequence = (str1, str2) => {
    let i = 0;
    let j = 0;
    while (i < str1.length) {
        if (j === str2.length) {
            return false;
        }
        if (str1[i] === str2[j]) {
            i++;
        }
        j++;
    };
    return true;
};

exports.getStoresByQuery = (req, res, next) => {
    const searchText = req.query.searchText;
    const city = req.query.city;
    if (searchText == null) return res.status(200).json({ message: "SearchText is a required parameter for searching" })
    if (city == null) return res.status(200).json({ message: "City is a required parameter for searching" })
    Store.find({ city: city }).exec().then(result => {
        const returnObj = []
        for (r of result) {
            let searchQuery = ''
            if (r.storeName != null) searchQuery += r.storeName
            if (r.city != null) searchQuery += r.city
            if (r.pinCode != null) searchQuery += r.pinCode
            if (r.address != null) searchQuery += r.address;
            if (isSubsequence(searchText.toLowerCase(), searchQuery.toLowerCase())) {
                returnObj.push(r)
            }
        }
        res.status(200).json({
            data: returnObj
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteStore = (req, res, next) => {
    const id = req.query.id

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
                            imageController.deleteImage(r);
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
                        imageController.deleteImage(r);
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
    });
}

exports.updateStore = (req, res, next) => {
    const id = req.query.id
    Store.findById(id).exec().then(result => {
        const image = result.storeImage;
        const updateObj = {}
        if (req.file !== undefined) {
            try {
                if (image != null)
                    imageController.deleteImage(image);
            } catch (e) {
                console.log('Image not available');
            }
            updateObj['storeImage'] = req.file.location;
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
    }).catch(err => res.status(500).json({
        error: err
    }));
}

exports.deleteStoreImage = (req, res, body) => {
    const id = req.query.id
    Store.findById(id).exec().then(result => {
        const image = result.storeImage;
        if (result != null) {
            if (image != null) { imageController.deleteImage(image) }
            const updateObj = { 'storeImage': null }
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
        } else {
            res.status(200).json({ message: 'No store found with id: ' + id });
        }
    }).catch(err => res.status(500).json({
        error: err
    }));
}