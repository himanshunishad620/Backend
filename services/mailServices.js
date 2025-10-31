const sgMail = require("@sendgrid/mail");
require("dotenv").config();
// const API_KEY =
//   ;
sgMail.setApiKey(process.env.API_KEY);
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
