const router = require('express').Router()
const mongoose = require('mongoose')
const multer = require('multer')

const checkAuth = require('../middlewares/checkAuth')
const storeController = require('../controllers/storeController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/storeImages/');
    },
    filename: function (req, file, cb) {
        cb(null, mongoose.Types.ObjectId() + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.post('/createStore', checkAuth, upload.single('storeImage'), storeController.createStore);

router.get('/getAllStores', storeController.getAllStores);

router.get('/getStoresByQuery', storeController.getStoresByQuery);

router.delete('/deleteStore', checkAuth, storeController.deleteStore)

router.patch('/updateStore', checkAuth, upload.single('storeImage'), storeController.updateStore)

module.exports = router