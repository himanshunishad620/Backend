const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const API_KEY =
  "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";
sgMail.setApiKey(API_KEY);
const sendEmail = async (to, subject, text) => {
  const message = {
    to,
    from: process.env.EMAIL_USER,
    subject,
    text,
  };
  sgMail
    .send(message)
    .then((res) => console.log("Email Sent"))
    .catch((err) => console.log(err));
};

module.exports = sendEmail;
