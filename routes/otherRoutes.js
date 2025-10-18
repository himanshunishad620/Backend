const express = require("express");
const router = express.Router();
const { contact, download } = require("../controllers/otherController");
router.post("/others/contact", contact);
module.exports = router;
