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

transporter.verify(() => {});

module.exports.sendEmail = async (body) => {
  try {
    const info = await transporter.sendMail(body);
    return info;
  } catch (error) {
    throw error;
  }
};
