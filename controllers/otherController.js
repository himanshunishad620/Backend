const sendEmail = require("../services/mailServices");

exports.contact = async (req, res) => {
  const { message, email, firstName, lastName } = req.body;
  try {
    await sendEmail(
      "himanshunishad620@gmail.com",
      "You have a new feedback",
      `By:${firstName} ${lastName}
       email:${email}
       ${message}`
    );
    res.status(200).json({ msg: "Message sent successfuly!" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};
