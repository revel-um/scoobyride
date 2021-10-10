const router = require('express').Router()
const verificationController = require('../controllers/verificationController')

router.get('/sendOtp', verificationController.sendOtp)

router.post('/verifyOtp', verificationController.verifyOtp)

module.exports = router;