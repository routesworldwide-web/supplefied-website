require("dotenv").config();
const nodemailer = require("nodemailer");
const { secret } = require("./secret");

const transporter = nodemailer.createTransport({
  service: secret.email_service,
  auth: {
    user: secret.email_user,
    pass: secret.email_pass,
  },
});

module.exports.sendEmail = async (body) => {
  try {
    const info = await transporter.sendMail(body);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Email error:", error.message);
    throw error;
  }
};