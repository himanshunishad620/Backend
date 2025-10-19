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
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const sendEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
