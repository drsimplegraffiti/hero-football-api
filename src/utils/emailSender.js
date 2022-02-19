const nodemailer = require("nodemailer");

const path = require("path");
const fs = require("fs");

const sendEmail = async (options, attachment = false) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    const message = {
      from: process.env.EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.message,
    };

    const m = await transporter.sendMail(message);
    console.log(m);
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendEmail;
