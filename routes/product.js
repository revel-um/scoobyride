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

router.get('/getTopProducts', productController.getTopProducts)

router.get('/getProductsOfStore', productController.getProductsOfStore)

router.delete('/deleteProduct/:productId', checkAuth, productController.deleteProduct)

module.exports = router;