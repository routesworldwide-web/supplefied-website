const validator = require('validator');
const AuthVerification = require('../model/AuthVerification');
const UsedCode = require('../model/UsedCode');
const codesData = require('../utils/codes.json');

// Get valid codes array
const validCodes = codesData.codes;

// Stricter email validation
const isValidEmail = (email) => {
  const strictEmailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!strictEmailRegex.test(email)) {
    return false;
  }
  
  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  // Check for invalid patterns
  if (email.startsWith('.') || email.endsWith('.')) {
    return false;
  }
  
  const [prefix, domain] = email.split('@');
  
  // Prefix validation
  if (prefix.length < 1 || prefix.length > 64) {
    return false;
  }
  
  if (prefix.startsWith('.') || prefix.endsWith('.')) {
    return false;
  }
  
  // Domain validation
  if (!domain || domain.length < 3) {
    return false;
  }
  
  // Get TLD (last part after last dot)
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  
  // TLD must be at least 2 characters and only letters
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return false;
  }
  
  // Check for obviously fake patterns
  const fakeDomains = ['test.com', 'example.com', 'sample.com', 'demo.com', 'localhost', 'invalid.com'];
  if (fakeDomains.includes(domain)) {
    return false;
  }
  
  return validator.isEmail(email);
};

// Verify Authentication Code
const verifyAuthCode = async (req, res) => {
  try {
    const { name, mobile, email, code } = req.body;

    // Validate required fields
    if (!name || !mobile || !email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, mobile, email, and code',
      });
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters',
      });
    }

    // Validate mobile (10 digits)
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be 10 digits',
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate code format
    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid authentication code',
      });
    }

    // Check if code exists in valid codes array
    const codeUpperCase = code.trim().toUpperCase();
    
    // Check if code has already been used
    const alreadyUsedCode = await UsedCode.findOne({ code: codeUpperCase });
    if (alreadyUsedCode) {
      return res.status(403).json({
        success: false,
        message: `This authentication code has already been used. Each code can only be used once.`,
        errorType: 'CODE_ALREADY_USED',
      });
    }

    const isValidCode = validCodes.includes(codeUpperCase);

    // Get client IP
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create or update auth verification record
    let authVerification = await AuthVerification.findOne({ email });

    if (!isValidCode) {
      // Invalid code - update attempt count
      if (authVerification) {
        authVerification.attemptCount += 1;
        authVerification.lastAttemptAt = new Date();
        authVerification.status = 'failed';
        await authVerification.save();
      } else {
        // First attempt with invalid code
        authVerification = new AuthVerification({
          name,
          mobile,
          email,
          code: codeUpperCase,
          status: 'failed',
          ipAddress,
          userAgent,
          attemptCount: 1,
        });
        await authVerification.save();
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid authentication code. Please try again.',
        attemptCount: authVerification.attemptCount,
      });
    }

    // Valid code - save authentication record and mark code as used
    authVerification = new AuthVerification({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.toLowerCase().trim(),
      code: codeUpperCase,
      isAuthenticated: true,
      status: 'authenticated',
      ipAddress,
      userAgent,
    });

    await authVerification.save();

    // Mark code as used - prevent duplicate usage
    const usedCode = new UsedCode({
      code: codeUpperCase,
      usedBy: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
      },
      ipAddress,
      userAgent,
    });

    await usedCode.save();

    return res.status(200).json({
      success: true,
      message: 'User authentication successful! 🎉',
      data: {
        id: authVerification._id,
        name: authVerification.name,
        email: authVerification.email,
        mobile: authVerification.mobile,
        authenticatedAt: authVerification.createdAt,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication verification',
      error: error.message,
    });
  }
};

// Get all authentication records (admin only)
const getAllAuthRecords = async (req, res) => {
  try {
    const records = await AuthVerification.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Authentication records retrieved successfully',
      totalRecords: records.length,
      authenticatedUsers: records.filter((r) => r.status === 'authenticated').length,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching auth records:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching authentication records',
      error: error.message,
    });
  }
};

// Get authentication record by email
const getAuthRecordByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const record = await AuthVerification.findOne({
      email: email.toLowerCase(),
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No authentication record found for this email',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Authentication record retrieved successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error fetching auth record:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the authentication record',
      error: error.message,
    });
  }
};

// Get all used codes
const getAllUsedCodes = async (req, res) => {
  try {
    const usedCodes = await UsedCode.find().sort({ usedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Used codes retrieved successfully',
      totalUsedCodes: usedCodes.length,
      data: usedCodes,
    });
  } catch (error) {
    console.error('Error fetching used codes:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching used codes',
      error: error.message,
    });
  }
};

// Check if a code is already used
const checkCodeUsage = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a code to check',
      });
    }

    const codeUpperCase = code.trim().toUpperCase();
    const usedCode = await UsedCode.findOne({ code: codeUpperCase });

    if (usedCode) {
      return res.status(200).json({
        success: true,
        isUsed: true,
        message: 'This code has already been used',
        data: usedCode,
      });
    }

    return res.status(200).json({
      success: true,
      isUsed: false,
      message: 'This code is available for use',
    });
  } catch (error) {
    console.error('Error checking code usage:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking code usage',
      error: error.message,
    });
  }
};

module.exports = {
  verifyAuthCode,
  getAllAuthRecords,
  getAuthRecordByEmail,
  getAllUsedCodes,
  checkCodeUsage,
};
