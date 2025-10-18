require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const generateToken = (payload) => {
  return sign({ _id: payload._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
};
// const verifyToken = (token) => {
//   const decoded = verify(token, process.env.SECRET_KEY);
//   return decoded;
// };
const verifyToken = (token) => {
  if (!token) {
    throw new Error("JWT must be provided");
  }

  try {
    const decoded = verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (err) {
    throw new Error("Invalid JWT");
  }
};

module.exports = { generateToken, verifyToken };
