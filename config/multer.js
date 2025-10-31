const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: "auto", // Allowed file types
  },
});

const upload = multer({ storage });

module.exports = upload;
