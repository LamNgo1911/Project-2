const nodemailer = require("nodemailer");

// Create a transporter using your SMTP server details
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "lamngo606@gmail.com",
    pass: "nlrpjsxylajeyhnp",
  },
});

module.exports = transporter;
