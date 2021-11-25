const mongoose = require('mongoose');
const fs = require('fs')
const Product = require('../schemas/productSchema')
const Store = require('../schemas/storeSchema')

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

const { Storage } = require('@google-cloud/storage')
const path = require('path')

const storage = new Storage({
    keyFilename: path.join(__dirname, '../madhuram-328908-1738d4396037.json'),
    projectId: "madhuram-328908",
});

function deleteObject(url) {
    if (url == null) return;
    new Promise((resolve, reject) => {
        const imageurl = replaceAll(url, 'https:/madhuram-storage.storage.googleapis.com/', '');
        storage
            .bucket("madhuram-storage")
            .file(imageurl)
            .delete()
            .then((image) => {
                resolve(image)
            })
            .catch((e) => {
                reject(e)
            });
    });
}

exports.createProduct = (req, res, next) => {
    const storeId = req.body.store;
    Store.findOne({ _id: storeId }).exec().then(result => {
        if (result == null) {
            return res.status(400).json({
                message: 'Invalid store id'
            })
        }
        const keys = Object.keys(req.body)
        const productObj = {}
        for (const key of keys) {
            if (key != 'productImages')
                productObj[key] = req.body[key]
        }
        productObj['_id'] = mongoose.Types.ObjectId();

        if (req.files !== undefined) {
            const paths = []
            for (file of req.files) {
                let path = replaceAll(file.path, '//', '/');
                path = replaceAll(path, 'madhuram-storage.storage.googleapis.com', '/storage.googleapis.com/madhuram-storage')
                paths.push(path);
            }
            productObj['productImages'] = paths;
        }

        const product = new Product(productObj);
        product.save().then(result => {
            res.status(200).json({
                message: "Product created successfully",
                object: product
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({
            error: err
        })
    })
}

exports.getProductsOfStore = (req, res, next) => {
    const storeId = req.query.storeId;
    Product.find({ store: storeId }).exec().then(result => {
        Store.findById(storeId).exec().then(result1 => {
            res.status(200).json({
                data: { 'products': result, 'store': result1 }
            })
        }).catch(err => {
            res.status(400).json({
                error: err
            })
        });
    }).catch(err => {
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

exports.getAllProducts = (req, res, next) => {
    const km = req.query.km;
    const lat0 = req.query.latitude;
    const lon0 = req.query.longitude;
    const city = req.query.city;

    if (lat0 == null || lon0 == null || km == null) {
        Product.find().populate({ path: 'store', match: { city: city } }).exec().then(result => {
            returnObj = []
            for (r of result) {
                if (r.store != null) returnObj.push(r)
            }
            res.status(200).json({
                data: returnObj
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
        return;
    }

    Product.find().populate({ path: 'store', match: { city: city } }).exec().then(result => {
        returnObj = []
        for (r of result) {
            if (r.store != null) {
                const lat1 = r.store.latitude
                const lon1 = r.store.longitude
                const distance = getDistanceFromLatLonInKm(lat0, lon0, lat1, lon1);
                if (distance < km) {
                    returnObj.push(r)
                }
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

exports.getProductsByQuery = (req, res, next) => {
    const searchText = req.query.searchText;
    const city = req.query.city;
    if (searchText == null) return res.status(200).json({ message: "searchText is a required parameter for searching" })
    if (city == null) return res.status(200).json({ message: "City is a required parameter for searching" })
    Product.find({ city: city }).exec().then(result => {
        const returnObj = []
        for (r of result) {
            let searchQuery = ''
            if (r.title != null) searchQuery += r.title
            if (r.criteria != null) searchQuery += r.criteria
            if (r.details != null) searchQuery += r.details
            if (r.bullets != null) searchQuery += r.bullets;

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

exports.updateProduct = (req, res, next) => {
    const id = req.query.id;
    Product.findOne({ _id: id }).exec().then(result => {
        if (result != null) {
            updateObj = {}
            for (const key of Object.keys(req.body)) {
                updateObj[key] = req.body[key];
            }
            if (req.files !== undefined) {
                const productImages = result.productImages;
                for (const imageUrl of productImages) {
                    deleteObject(imageUrl);
                }
                const paths = []
                for (file of req.files) {
                    let path = replaceAll(file.path, '//', '/');
                    path = replaceAll(path, 'madhuram-storage.storage.googleapis.com', '/storage.googleapis.com/madhuram-storage');
                    paths.push(path);
                }
                updateObj['productImages'] = paths;
            }
            Product.updateOne({ _id: id }, { $set: updateObj }).exec().then(result => {
                res.status(200).json({ data: result })
            }).catch(err => {
                res.status(500).json({ error: err })
            })
        }
    }).catch(err => {
        res.status(500).json({ error: err })
    })
}

exports.deleteProduct = (req, res, next) => {
    const id = req.query.id;
    Product.findById(id).exec().then(result => {
        for (const image of result.productImages) {
            try {
                deleteObject(image);
            } catch (e) {
                console.log('Image not available');
            }
        }
        Product.deleteOne({
            _id: id
        }).exec().then(result => {
            res.status(200).json({
                message: 'Deleted successfully',
                result: result
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: "Product not available",
            error: err
        })
    })
}