const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth')
const userController = require('../controllers/userController')
const imageController = require('../controllers/imageController')

router.patch('/updateUser', checkAuth, imageController.uploadImage.single('profilePicture'), userController.updateUser)

router.get('/getCurrentUser', checkAuth, userController.getCurrentUser)

router.delete('/deleteUser', checkAuth, userController.deleteUser)

//Below 2 apis are just for making my life easy for development and hence never be used
router.get('/getAllUsers', userController.getAllUsers)

router.delete('/deleteUserById', userController.deleteUserById)

module.exports = router;