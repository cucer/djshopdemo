const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// /api/products
router
  .route('/')
  .get(auth.protect, productController.getHomeProducts)
  .post(auth.protect, auth.admin, productController.createProduct);

// /api/products/admin
router
  .route('/admin')
  .get(auth.protect, auth.admin, productController.getAdminProducts);

// /api/products:id/reviews
router
  .route('/:id/reviews')
  .post(auth.protect, productController.createProductReview);

// /api/products/top
router.get('/top', auth.protect, productController.getTopProducts);

// /api/products:id
router
  .route('/:id')
  .get(auth.protect, productController.getProductById)
  .delete(auth.protect, auth.admin, productController.deleteProduct)
  .put(auth.protect, auth.admin, productController.updateProduct);

module.exports = router;
