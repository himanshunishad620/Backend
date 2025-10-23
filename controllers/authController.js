const User = require("../models/userModel");
const UserStorage = require("../models/userStorageModel");
const {
  generateToken,
  verifyToken,
  generateTempToken,
} = require("../services/jwtServices");
const sendEmail = require("../services/mailServices");
const { storeOTP, verifyOTP } = require("../services/otpServices");

exports.generateOtp = async (req, res) => {
  const { email } = req.body;
  const isRegistered = await User.findOne({ email });
  if (isRegistered)
    return res
      .status(404)
      .json({ success: false, msg: "Email is already registered!" });
  const otp = await storeOTP(email);
  if (!otp)
    return res.status(404).json({ success: false, msg: "Unable to sendOtp!" });
  try {
    await sendEmail(email, "Your Register OTP", `Your OTP is ${otp}`);
    res.status(200).json({ success: true, msg: "OTP sent successfully!", otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

exports.register = async (req, res) => {
  const { email, password, otp } = req.body;
  const isValid = await verifyOTP(email, otp);
  if (!isValid) return res.status(404).json({ msg: "Invalid OTP!" });

  try {
    const result = await User.insertOne({ email, password });
    const response = await UserStorage.insertOne({ userId: result._id });
    console.log(response);
    res.status(200).json({ msg: "Registered Successfully!", result });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Something went wrong!" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  const user = await User.findOne({ email });
  // console.log(user);
  const isMatch = user?.password === password;
  if (!user || !isMatch)
    return res.status(404).json({ msg: "Invalid Credentials!" });
  const token = generateToken(user.toObject());
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 2,
  });
  res
    .status(200)
    .json({ msg: "Logged in Successfully!", token, _id: user._id });
};

exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  // console.log(token);

  if (!token) return res.status(401).json({ message: "No token found" });
  try {
    const decoded = verifyToken(token);
    res.status(200).json({ message: "Token verified", decoded });
  } catch (err) {
    res.status(404).json({ message: "Invalid token" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found!" });
  try {
    const token = generateTempToken(email);
    await sendEmail(
      email,
      "Reset Password Link ",
      "Password Reset Link https://backend-u36p.onrender.com/auth/resetPassword?token=" +
        token
    );
    res.status(200).json({ success: true, msg: "Link sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token) return res.status(404).json({ msg: "Token not found!" });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(404).json({ msg: "Invalid token!" });
  const email = decoded.email;
  // const res = await User.updateOne({ email }, { $set: { password } });
  // console.log(user);
  try {
    const response = await User.updateOne({ email }, { $set: { password } });
    console.log(response);
    await sendEmail(
      email,
      "Password Changed Successfully! ",
      "You password has changed successfully!"
    );
    res
      .status(200)
      .json({ success: true, msg: "Password reset successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal server error!" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({ message: "Logged out and cookie cleared" });
};
