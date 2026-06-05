const express = require('express');
const {
  verifyAuthCode,
  getAllAuthRecords,
  getAuthRecordByEmail,
  getAllUsedCodes,
  checkCodeUsage,
} = require('../controller/auth.controller');

const router = express.Router();

// Public Routes
router.post('/verify', verifyAuthCode);

// Check if a code is already used
router.get('/check-code/:code', checkCodeUsage);

// Get auth record by email
router.get('/record/:email', getAuthRecordByEmail);

// Admin Routes
router.get('/records/all', getAllAuthRecords);

// Get all used codes
router.get('/used-codes/all', getAllUsedCodes);

module.exports = router;
