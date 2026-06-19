const express = require("express");
const newsletterController = require("../controller/newsletter.controller");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.post("/subscribe", newsletterController.subscribeToNewsletter);
router.get("/subscribers", verifyAdmin, newsletterController.getNewsletterSubscribers);

module.exports = router;
