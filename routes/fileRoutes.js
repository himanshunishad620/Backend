const express = require("express");
const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./../config/cloudinary");
const {
  fileUpload,
  getStorage,
  download,
  deleteFile,
  renameFile,
} = require("../controllers/fileController");

const router = express.Router();

// Storage setup
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads", // Cloudinary folder name
//     resource_type: "auto", // auto = images, videos, pdf, docs, etc.
//   },
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const ext = file.originalname.split(".").pop().toLowerCase();

//     let resourceType = "raw"; // default for safety
//     if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
//       resourceType = "image";
//     } else if (
//       [
//         "mp4",
//         "mov",
//         "avi",
//         "mkv",
//         "webm",
//         "mp3",
//         "wav",
//         "ogg",
//         "aac",
//         "flac",
//       ].includes(ext)
//     ) {
//       resourceType = "video";
//     }

//     return {
//       folder: "uploads",
//       resource_type: resourceType,
//       public_id: file.originalname.replace(/\s+/g, "_"),
//     };
//   },
// });
// const upload = multer({ storage: storage });
const ṭemostorage = multer.memoryStorage();
const upload = multer({ ṭemostorage });

// Upload route
router.post("/file/upload", upload.single("file"), fileUpload);
router.get("/file/download", download);
router.get("/file/getStorage", getStorage);
router.get("/file/deleteFile", deleteFile);
router.post("/file/renameFile", renameFile);

// export default router;

module.exports = router;

// // backend/routes/upload.js
// const express = require("express");
// const router = express.Router();
// const upload = require("../config/multer");
// const { fileUpload } = require("../controllers/fileController");

// router.post("/file/upload", upload.single("file"), fileUpload);

// module.exports = router;
