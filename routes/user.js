const mongoose = require('mongoose')
const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth')
const userController = require('../controllers/userController')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/storeImages/');
    },
    filename: function (req, file, cb) {
        cb(null, mongoose.Types.ObjectId() + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.patch('/updateUser', checkAuth, upload.single('profilePicture'), userController.updateUser)

router.get('/getCurrentUser', checkAuth, userController.getCurrentUser)

router.delete('/deleteUser', checkAuth, userController.deleteUser)

//Below 2 apis are just for making my life easy for development and hence never be used
router.get('/getAllUsers', userController.getAllUsers)

router.delete('/deleteUserById', userController.deleteUserById)

module.exports = router;