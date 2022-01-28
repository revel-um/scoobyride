const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth')
const storeController = require('../controllers/storeController')
const imageController = require('../controllers/imageController')


router.post('/createStore', checkAuth, imageController.uploadImage.single('storeImage'), storeController.createStore);

router.get('/getAllStores', checkAuth, storeController.getAllStores);

router.get('/getStoreById', checkAuth, storeController.getStoreById);

router.get('/getStoresByPhone', checkAuth, storeController.getStoreByPhone);

router.get('/getStoresByQuery', checkAuth, storeController.getStoresByQuery);

router.delete('/deleteStore', checkAuth, storeController.deleteStore)

router.patch('/updateStore', checkAuth, imageController.uploadImage.single('storeImage'), storeController.updateStore)

module.exports = router