const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // file must have a name
      trim: true,
    },
    size: {
      type: Number,
      required: true, // must store size
    },
    downloadUrl: {
      type: String,
      required: true, // unique id for download
      unique: true, // ensures no duplicate downloadIds
    },
    fileType: {
      type: String,
      required: true, // must store type (pdf, image, etc.)
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const recentUploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // file must have a name
      trim: true,
    },
    fileType: {
      type: String,
      required: true, // must store type (pdf, image, etc.)
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
