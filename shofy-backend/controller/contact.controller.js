const validator = require('validator');
const { sendEmail } = require('../config/email');
const { secret } = require('../config/secret');

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

// Send contact form message to admin email
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message',
      });
    }

    // Trim and validate
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim().toLowerCase();
    const subjectTrimmed = subject.trim();
    const messageTrimmed = message.trim();

    if (nameTrimmed.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long',
      });
    }

    if (!isValidEmail(emailTrimmed)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (subjectTrimmed.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Subject must be at least 3 characters long',
      });
    }

    if (messageTrimmed.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long',
      });
    }

    // Admin email address
    const adminEmail = secret.admin_email || secret.email_user;

    // Prepare email to admin
    const adminEmailContent = {
      from: secret.email_user,
      to: adminEmail,
      subject: `New Contact Form Query: ${subjectTrimmed}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${nameTrimmed}</p>
        <p><strong>Email:</strong> <a href="mailto:${emailTrimmed}">${emailTrimmed}</a></p>
        <p><strong>Subject:</strong> ${subjectTrimmed}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${messageTrimmed.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><small>This is an automated email from your website contact form.</small></p>
      `,
    };

    // Prepare confirmation email to user
    const userEmailContent = {
      from: secret.email_user,
      to: emailTrimmed,
      subject: 'We received your message - Supplefied',
      html: `
        <h2>Thank You for Contacting Us!</h2>
        <p>Hi ${nameTrimmed},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <hr />
        <p><strong>Your Message Details:</strong></p>
        <p><strong>Subject:</strong> ${subjectTrimmed}</p>
        <p><strong>Message:</strong></p>
        <p>${messageTrimmed.replace(/\n/g, '<br>')}</p>
        <hr />
        <p>Best regards,<br />Supplefied Team</p>
        <p><small>If you have any questions, please reply to this email.</small></p>
      `,
    };

    // Send emails
    await sendEmail(adminEmailContent);
    await sendEmail(userEmailContent);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = {
  sendContactMessage,
};
