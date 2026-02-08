const Mailjet = require("node-mailjet");
require("dotenv").config();

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY,
);

const sendEmail = async ({ to, subject, text }) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER,
            Name: "DriveX",
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: text,
        },
      ],
    });
  } catch (error) {
    console.error("Mail Error:", error);
  }
};

module.exports = sendEmail;

// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();
// // const API_KEY =
// //   ;
// sgMail.setApiKey(process.env.API_KEY);
// const sendEmail = async (to, subject, text) => {
//   const message = {
//     to,
//     from: process.env.EMAIL_USER,
//     subject,
//     text,
//   };
//   sgMail
//     .send(message)
//     .then((res) => console.log("Email Sent"))
//     .catch((err) => console.log(err));
// };

// module.exports = sendEmail;
