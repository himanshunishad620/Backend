const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
      unique: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const recentUploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    spaceTaken: { type: Number, default: 0 },
    noOfFiles: { type: Number, default: 0 },
  },
  { _id: false }
);

const userStorageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  document: { type: categorySchema, default: {} },
  image: { type: categorySchema, default: {} },
  media: { type: categorySchema, default: {} },
  other: { type: categorySchema, default: {} },
  lastUpload: [{ type: recentUploadSchema, default: {} }],
  files: [{ type: fileSchema, default: {} }],
});

const UserStorage = mongoose.model("UserStorage", userStorageSchema);
module.exports = UserStorage;
