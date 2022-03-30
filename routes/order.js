const router = require('express').Router()
const orderController = require('../controllers/orderController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/addOrUpdateOrderState', checkAuth, orderController.addOrUpdateOrderState)

module.exports = router;