const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// /api/orders
router
  .route("/")
  .post(auth.protect, orderController.addOrderItems)
  .get(auth.protect, auth.admin, orderController.getOrders);

// /api/orders/myorders
router.route("/myorders").get(auth.protect, orderController.getMyOrders);

// /api/orders:id
router.route("/:id").get(auth.protect, orderController.getOrderById);

// /api/orders:id/paqy
router.route("/:id/pay").put(auth.protect, orderController.updateOrderToPaid);

// /api/orders:id/deliver
router
  .route("/:id/deliver")
  .put(auth.protect, auth.admin, orderController.updateOrderToDelivered);

module.exports = router;
