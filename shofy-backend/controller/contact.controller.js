const ContactMessage = require("../model/ContactMessage");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");
const {
  createAdminNotification,
} = require("../services/notification.service");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const submitContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    const preview =
      contactMessage.message.length > 120
        ? `${contactMessage.message.slice(0, 117)}...`
        : contactMessage.message;

    await createAdminNotification({
      type: "contact",
      category: "general",
      title: "New contact form query",
      message: `${contactMessage.name}: ${contactMessage.subject}. ${preview} Check the support email for the complete query.`,
      entityId: contactMessage._id,
      metadata: {
        email: contactMessage.email,
        subject: contactMessage.subject,
        message: contactMessage.message,
      },
    });

    try {
      await sendEmail({
        from: secret.email_user,
        to: secret.email_user,
        replyTo: contactMessage.email,
        subject: `Contact form: ${contactMessage.subject}`,
        html: `
          <h2>New Supplefied contact query</h2>
          <p><strong>Name:</strong> ${escapeHtml(contactMessage.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(contactMessage.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(contactMessage.subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(contactMessage.message).replace(/\n/g, "<br />")}</p>
        `,
      });
    } catch (emailError) {
      console.error("Contact email delivery failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return res.status(400).json({
        success: false,
        message: firstError?.message || "Please check your contact details.",
      });
    }

    next(error);
  }
};

module.exports = {
  submitContactMessage,
};
