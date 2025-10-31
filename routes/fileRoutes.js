const express = require("express");
const multer = require("multer");
const {
  fileUpload,
  getStorage,
  download,
  deleteFile,
  renameFile,
} = require("../controllers/fileController");

const router = express.Router();
const ṭemostorage = multer.memoryStorage();
const upload = multer({ ṭemostorage });

router.post("/file/upload", upload.single("file"), fileUpload);
router.get("/file/download", download);
router.get("/file/getStorage", getStorage);
router.get("/file/deleteFile", deleteFile);
router.post("/file/renameFile", renameFile);

module.exports = router;
