const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/placeOrder', checkAuth, orderController.placeOrder)

router.get('/getOrders', checkAuth, orderController.getOrders)

router.get('/cancelOrder', orderController.cancelOrder)

module.exports = router;