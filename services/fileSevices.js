const path = require("path");

// Function to categorize file based on extension or MIME type
const categorizeFile = (file) => {
  const originalName = file.originalname.toLowerCase();
  const mimeType = file.mimetype.toLowerCase();
  const extension = path.extname(originalName).slice(1); // Remove the dot

  // Categorization logic
  if (isImage(extension, mimeType)) return "image";
  if (isVideo(extension, mimeType)) return "media";
  if (isDocument(extension, mimeType)) return "document";
  return "other";
};

const getCategoryUpdate = (fileType, fileSize, inc) => {
  //   const category = getFileCategory(fileType); // Your categorization function
  const newFileSize = inc ? fileSize : -1 * fileSize;
  const newNoOfFiles = inc ? 1 : -1;
  return {
    [`${fileType}.spaceTaken`]: newFileSize,
    [`${fileType}.noOfFiles`]: newNoOfFiles,
  };
};

// Helper functions for each category
function isImage(extension, mimeType) {
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
    "ico",
  ];
  const imageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];

  return (
    imageExtensions.includes(extension) ||
    imageMimeTypes.some((type) => mimeType.includes(type))
  );
}

function isVideo(extension, mimeType) {
  const videoExtensions = [
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "webm",
    "mkv",
    "m4v",
    "3gp",
  ];
  const videoMimeTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/webm",
  ];

  return (
    videoExtensions.includes(extension) ||
    videoMimeTypes.some((type) => mimeType.includes(type))
  );
}

function isDocument(extension, mimeType) {
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "rtf",
    "odt",
    "xls",
    "xlsx",
    "csv",
    "ods",
    "ppt",
    "pptx",
    "odp",
    "html",
    "htm",
    "css",
    "js",
    "json",
    "xml",
  ];

  const documentMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/html",
    "text/css",
    "application/javascript",
    "application/json",
  ];

  return (
    documentExtensions.includes(extension) ||
    documentMimeTypes.some((type) => mimeType.includes(type))
  );
}

const getResourceType = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();

  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg"];
  const videoExts = ["mp4", "mov", "avi", "mkv", "flv", "webm", "wmv", "mpeg"];

  if (imageExts.includes(ext)) {
    return "image";
  } else if (videoExts.includes(ext)) {
    return "video";
  } else {
    return "raw"; // fallback for pdf, docs, zip, audio, etc.
  }
};

module.exports = {
  categorizeFile,
  getCategoryUpdate,
  getResourceType,
};
