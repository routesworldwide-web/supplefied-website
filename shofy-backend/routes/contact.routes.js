const express = require('express');
const { sendContactMessage } = require('../controller/contact.controller');

const router = express.Router();

// Public route - send contact form message
router.post('/send-message', sendContactMessage);

module.exports = router;
