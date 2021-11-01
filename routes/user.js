const mongoose = require('mongoose')
const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth')
const userController = require('../controllers/userController')
const path = require('path')

const multer = require('multer')
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

router.patch('/updateUser', checkAuth, upload.single('profilePicture'), userController.updateUser)

router.get('/getCurrentUser', checkAuth, userController.getCurrentUser)

router.delete('/deleteUser', checkAuth, userController.deleteUser)

//Below 2 apis are just for making my life easy for development and hence never be used
router.get('/getAllUsers', userController.getAllUsers)

router.delete('/deleteUserById', userController.deleteUserById)

module.exports = router;