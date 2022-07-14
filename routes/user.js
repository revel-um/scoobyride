const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth')
const userController = require('../controllers/userController')
const imageController = require('../controllers/imageController')

router.patch('/updateUser', checkAuth, imageController.uploadImage.single('profilePicture'), userController.updateUser)

router.get('/getCurrentUser', checkAuth, userController.getCurrentUser)

router.delete('/deleteUser', checkAuth, userController.deleteUser)

router.get('/getAllUsers', userController.getAllUsers)

router.delete('/removeProfilePicture', checkAuth, userController.removeProfilePicture)

module.exports = router;