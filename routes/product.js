const mongoose = require('mongoose');
const multer = require('multer')
const checkAuth = require('../middlewares/checkAuth')
const router = require('express').Router();

const productController = require('../controllers/productController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/productImages/');
    },
    filename: function (req, file, cb) {
        cb(null, mongoose.Types.ObjectId() + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.post('/createProduct', checkAuth, upload.array('productImages'), productController.createProduct)

router.get('/getAllProducts', productController.getAllProducts)

router.get('/getProductsByQuery', productController.getProductsByQuery)

router.get('/getProductsOfStore', productController.getProductsOfStore)

router.patch('/updateProduct', productController.updateProduct)

router.delete('/deleteProduct', checkAuth, productController.deleteProduct)

module.exports = router;