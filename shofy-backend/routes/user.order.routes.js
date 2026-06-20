const express = require('express');
const router = express.Router();
const userOrderController = require('../controller/user.order.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');


// get dashboard amount
router.get('/dashboard-amount', verifyAdmin, userOrderController.getDashboardAmount);

// get sales-report
router.get('/sales-report', verifyAdmin, userOrderController.getSalesReport);

// get sales-report
router.get('/most-selling-category', verifyAdmin, userOrderController.mostSellingCategory);

// get sales-report
router.get('/dashboard-recent-order', verifyAdmin, userOrderController.getDashboardRecentOrder);

// cancel a pending order owned by the logged-in customer
router.patch('/:id/cancel', verifyToken, userOrderController.cancelOrderByUser);

//get a order by id
router.get('/:id', verifyToken, userOrderController.getOrderById);

//get all order by a user
router.get('/',verifyToken, userOrderController.getOrderByUser);

module.exports = router;
