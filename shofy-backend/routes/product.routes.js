const express = require('express');
const router = express.Router();
// internal
const productController = require('../controller/product.controller');
const verifyAdmin = require('../middleware/verifyAdmin');

// add a product
router.post('/add', verifyAdmin, productController.addProduct);
// add all product
router.post('/add-all', verifyAdmin, productController.addAllProducts);
// get all products
router.get('/all', productController.getAllProducts);
// get offer timer product
router.get('/offer', productController.getOfferTimerProducts);
// top rated products
router.get('/top-rated', productController.getTopRatedProducts);
// reviews products
router.get('/review-product', verifyAdmin, productController.reviewProducts);
// get popular products by type
router.get('/popular/:type', productController.getPopularProductByType);
// get Related Products
router.get('/related-product/:id', productController.getRelatedProducts);
// get Single Product
router.get("/single-product/:id", productController.getSingleProduct);
// stock Product
router.get("/stock-out", verifyAdmin, productController.stockOutProducts);
// get Single Product
router.patch("/edit-product/:id", verifyAdmin, productController.updateProduct);
// get Products ByType
router.get('/:type', productController.getProductsByType);
// get Products ByType 
router.delete('/:id', verifyAdmin, productController.deleteProduct);

module.exports = router;
