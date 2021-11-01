const mongoose = require('mongoose');
const multer = require('multer')
const checkAuth = require('../middlewares/checkAuth')
const router = require('express').Router();

const productController = require('../controllers/productController')

const path = require('path')
const multerGoogleStorage = require('multer-google-storage')

const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        autoRetry: true,
        keyFilename: require.resolve('./madhuram-328908-1738d4396037.json'),
        projectId: "madhuram-328908",
        bucket: 'madhuram-storage',
        filename: (req, file, cb) => {
            cb(null, '/images/' + Date.now() + file.originalname);
        }
    })
});

router.post('/createProduct', checkAuth, upload.array('productImages'), productController.createProduct)

router.get('/getAllProducts', productController.getAllProducts)

router.get('/getProductsByQuery', productController.getProductsByQuery)

router.get('/getProductsOfStore', productController.getProductsOfStore)

router.patch('/updateProduct', checkAuth, upload.array('productImages'), productController.updateProduct)

router.delete('/deleteProduct', checkAuth, productController.deleteProduct)

module.exports = router;