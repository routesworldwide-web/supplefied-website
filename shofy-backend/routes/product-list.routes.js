const express = require("express");
const productListController = require("../controller/product-list.controller");

const router = express.Router();

router.post("/merge", productListController.mergeGuestLists);
router.get("/:type", productListController.getList);
router.post("/:type/items", productListController.addProduct);
router.delete("/:type/items/:productId", productListController.removeProduct);
router.delete("/:type", productListController.clearList);

module.exports = router;
