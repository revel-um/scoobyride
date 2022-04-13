const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/addOrUpdateOrderState', checkAuth, orderController.addOrUpdateOrderState)
router.get('/getMyOrders', checkAuth, orderController.getMyOrders)

module.exports = router;