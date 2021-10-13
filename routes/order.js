const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/placeOrder', checkAuth, orderController.placeOrder)

router.post('/getUnpreparedOrders', checkAuth, orderController.getUnpreparedOrders)

router.post('/getActiveOrders', checkAuth, orderController.getActiveOrders)

router.post('/getOrderHistory', checkAuth, orderController.getOrderHistory)

module.exports = router;