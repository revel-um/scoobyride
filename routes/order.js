const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')
router.post('/createOrder', orderController.createOrder)
module.exports = router;