require("dotenv").config();
const nodemailer = require("nodemailer");
const { secret } = require("./secret");

const getTransportConfig = () => {
  const auth = {
    user: secret.email_user,
    pass: secret.email_pass,
  };

  if (secret.email_service) {
    return {
      service: secret.email_service,
      auth,
    };
  }

  return {
    host: secret.email_host,
    port: Number(secret.email_port || 587),
    secure: Number(secret.email_port) === 465,
    auth,
  };
};

const transporter = nodemailer.createTransport(getTransportConfig());

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service ready to send messages");
  }
});

module.exports.sendEmail = async (body) => {
  try {
    const info = await transporter.sendMail(body);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.log("Email error:", error.message);
    throw error;
  }
};
