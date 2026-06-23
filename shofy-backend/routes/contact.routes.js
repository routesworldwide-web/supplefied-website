
const express = require("express");
const {
  submitContactMessage,
} = require("../controller/contact.controller");
const { requireTurnstile } = require("../middleware/verifyTurnstile");

const router = express.Router();

router.post("/", requireTurnstile("contact"), submitContactMessage);


module.exports = router;
