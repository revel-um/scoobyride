const checkAuth = require('../middlewares/checkAuth')
const router = require('express').Router();
const imageController = require('../controllers/imageController')


const productController = require('../controllers/productController')

router.post('/createProduct', imageController.uploadImage.array('productImages'), productController.createProduct)

router.get('/getAllProducts', productController.getAllProducts)

router.get('/getProductsByQuery', productController.getProductsByQuery)

router.get('/getProductsOfStore', productController.getProductsOfStore)

router.patch('/updateProduct', checkAuth, imageController.uploadImage.array('productImages'), productController.updateProduct)

router.delete('/deleteProduct', checkAuth, productController.deleteProduct)

router.patch('/deleteImage', productController.deleteImageFromProduct)

module.exports = router;