
const express = require("express");
const {
  submitContactMessage,
} = require("../controller/contact.controller");

const router = express.Router();

router.post("/", submitContactMessage);


module.exports = router;
