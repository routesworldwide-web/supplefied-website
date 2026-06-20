const express = require('express');
const router = express.Router();
// internal
const brandController = require('../controller/brand.controller');
const verifyAdmin = require('../middleware/verifyAdmin');

// add Brand
router.post('/add', verifyAdmin, brandController.addBrand);
// add All Brand
router.post('/add-all', verifyAdmin, brandController.addAllBrand);
// get Active Brands
router.get('/active',brandController.getActiveBrands);
// get all Brands
router.get('/all',brandController.getAllBrands);
// delete brand
router.delete('/delete/:id', verifyAdmin, brandController.deleteBrand);
// get single
router.get('/get/:id', brandController.getSingleBrand);
// delete product
router.patch('/edit/:id', verifyAdmin, brandController.updateBrand);

module.exports = router;
