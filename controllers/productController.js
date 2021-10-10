const mongoose = require('mongoose');
const fs = require('fs')
const Product = require('../schemas/productSchema')

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.createProduct = (req, res, next) => {
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
            const path = process.env.BASE_URL + replaceAll(file.path, '\\\\', '/');
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
}

exports.getTopProducts = (req, res, next) => {
    Product.find().exec().then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.getProductsOfStore = (req, res, next) => {
    const storeId = req.query.storeId;
    Product.find({ store: storeId }).exec().then(result => {
        res.status(200).json({
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    console.log(id);
    Product.findById(id).exec().then(result => {
        for (const image of result.productImages) {
            const url = image.replace(process.env.BASE_URL, '');
            fs.unlinkSync(url);
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