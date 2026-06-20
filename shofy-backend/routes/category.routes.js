const express = require('express');
const router = express.Router();
// internal
const categoryController = require('../controller/category.controller');
const verifyAdmin = require('../middleware/verifyAdmin');

// get
router.get('/get/:id', categoryController.getSingleCategory);
// add
router.post('/add', verifyAdmin, categoryController.addCategory);
// add All Category
router.post('/add-all', verifyAdmin, categoryController.addAllCategory);
// get all Category
router.get('/all', categoryController.getAllCategory);
// get Product Type Category
router.get('/show/:type', categoryController.getProductTypeCategory);
// get Show Category
router.get('/show', categoryController.getShowCategory);
// delete category
router.delete('/delete/:id', verifyAdmin, categoryController.deleteCategory);
// delete product
router.patch('/edit/:id', verifyAdmin, categoryController.updateCategory);

module.exports = router;
