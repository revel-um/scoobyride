const checkAuth = require('../middlewares/checkAuth')
const router = require('express').Router();
const imageController = require('../controllers/imageController')
const orderController = require('../controllers/orderController')


const productController = require('../controllers/productController')

router.post('/createProduct', checkAuth, imageController.uploadImage.array('productImages'), productController.createProduct)

router.get('/getAllProducts', checkAuth, orderController.getOrderState, productController.getAllProducts)

router.get('/getAllProductsWithoutAuth', productController.getAllProductsWithoutAuth)

router.get('/getProductsByQuery', checkAuth, orderController.getOrderState, productController.getProductsByQuery)

router.get('/getProductsOfStore', checkAuth, orderController.getOrderState, productController.getProductsOfStore)

router.patch('/updateProduct', checkAuth, imageController.uploadImage.array('productImages'), productController.updateProduct)

router.delete('/deleteProduct', checkAuth, productController.deleteProduct)

router.patch('/deleteImage', checkAuth, productController.deleteImageFromProduct)

router.patch('/updateRatings', productController.updateRatings)

module.exports = router;