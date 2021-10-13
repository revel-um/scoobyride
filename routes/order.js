const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/placeOrder', checkAuth, orderController.placeOrder)

module.exports = router;