const express = require("express");
const router = express.Router();
const {
  generateOtp,
  register,
  login,
  verifyToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("./../controllers/authController");
router.post("/auth/generateOtp", generateOtp);
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/verifyToken", verifyToken);
router.get("/auth/logout", logout);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword", resetPassword);
module.exports = router;
