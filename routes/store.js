const router = require('express').Router()
const mongoose = require('mongoose')

const path = require('path')

const multer = require('multer')
const multerGoogleStorage = require('multer-google-storage')

const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        autoRetry: true,
        // keyFilename: path.join(__dirname, '../madhuram-328908-1738d4396037.json'),
        projectId: "madhuram-328908",
        bucket: 'madhuram-storage',
        filename: (req, file, cb) => {
            cb(null, '/images/' + Date.now() + file.originalname);
        }
    }),
});

const checkAuth = require('../middlewares/checkAuth')
const storeController = require('../controllers/storeController')

router.post('/createStore', checkAuth, upload.single('storeImage'), storeController.createStore);

router.get('/getAllStores', storeController.getAllStores);

router.get('/getStoresByPhone', storeController.getStoreByPhone);

router.get('/getStoresByQuery', storeController.getStoresByQuery);

router.delete('/deleteStore', checkAuth, storeController.deleteStore)

router.patch('/updateStore', checkAuth, upload.single('storeImage'), storeController.updateStore)

module.exports = router