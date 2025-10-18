const { default: axios } = require("axios");
const UserStorage = require("../models/userStorageModel");
const { verifyToken } = require("../services/jwtServices");
const Cloudinary = require("./../config/cloudinary");
const {
  categorizeFile,
  getCategoryUpdate,
  getResourceType,
} = require("./../services/fileSevices");

exports.renameFile = async (req, res) => {
  const { _id, fileName, newName } = req.body;

  const token = req.cookies.token;
  if (!token) return res.status(404).json({ msg: "Token Not Found!" });

  const userId = verifyToken(req.cookies.token)._id;
  console.log(newName);
  console.log(fileName);
  console.log(_id);
  const newFileName = newName + "." + fileName.split(".").pop();
  try {
    if (!userId || !newName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // update only the `name` field of the matching file
    const result = await UserStorage.updateOne(
      { userId, "files._id": _id },
      { $set: { "files.$.name": newFileName } }
    );
    console.log(result);

    return res.json({ message: "File renamed successfully" });
  } catch (error) {
    console.error("Error renaming file:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFile = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(404).json({ msg: "No valid Token" });
  }
  const userId = verifyToken(req.cookies.token)._id;
  try {
    const { public_id, fileName, _id, type, size } = req.query;
    const resource_type = getResourceType(fileName);
    if (!public_id) {
      return res.status(400).json({ error: "public_id is required" });
    }

    // Delete file
    const result = await Cloudinary.uploader.destroy(public_id, {
      resource_type, // "image", "video", or "raw"
    });

    const deletedFile = await UserStorage.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          files: { _id: _id },
        },
        $inc: getCategoryUpdate(type, size, false),
      },

      { new: true } // Return updated doc, create if doesn't exist
    );

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStorage = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(404).json({ msg: "No valid Token" });
  }
  const userId = verifyToken(req.cookies.token)._id;
  const now = new Date();
  try {
    const result = await UserStorage.findOne({ userId });
    res.status(200).json({
      result,
      local: now.toLocaleString("en-IN", {
        // hour: "numeric",
        // minute: "numeric",
        // hour12: true,
        timeZone: "Asia/Kolkata",

        hour: "numeric",
        minute: "numeric",
        hour12: true, // for AM/PM
        // day: "numeric",
        // month: "long", // e.g., September
        // year: "numeric",
      }),
    });
  } catch (error) {
    res.status(404).json({ msg: "Not found!" });
  }
};

exports.fileUpload = async (req, res) => {
  const file = req.file;
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  const type = categorizeFile(req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resultClodinary = await Cloudinary.uploader.upload_stream(
      { resource_type: getResourceType(file.originalname) }, // auto = handles image, video, pdf, etc.
      async (error, uploadedFile) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed", error });
        }
        console.log(uploadedFile);
        const newFile = {
          name: file.originalname,
          size: file.size,
          downloadUrl: uploadedFile.secure_url,
          fileType: type,
          publicId: uploadedFile.public_id,
        };
        const result = await UserStorage.findOneAndUpdate(
          { userId: decoded._id },
          {
            $push: {
              files: newFile,
              lastUpload: { name: newFile.name, fileType: type },
            },
            $inc: getCategoryUpdate(type, newFile.size, true),
          },

          { new: true } // Return updated doc, create if doesn't exist
        );
        res.json(result);
      }
    );
    resultClodinary.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.download = async (req, res) => {
  const { url, fileName } = req.query;
  try {
    if (!url) return res.status(400).json({ message: "URL is required" });

    const parts = url.split("/");

    const publicId = parts[parts.length - 1].split(".")[0]; // remove extension if any

    const info = await Cloudinary.api.resource(publicId, {
      resource_type: getResourceType(fileName),
    });
    const fileUrl = info.secure_url;
    // const newFileName = `${name}.${ext}`;

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
};

// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     const { userId, description, category } = req.body;
//     const cloudinaryFile = req.file;

//     if (!cloudinaryFile) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Extract file details from Cloudinary response
//     const fileDetails = {
//       // Basic info
//       name: cloudinaryFile.originalname,
//       size: cloudinaryFile.size,
//       fileType: cloudinaryFile.format || cloudinaryFile.resource_type,
//       downloadId: cloudinaryFile.public_id, // Use Cloudinary public_id as download ID

//       // Cloudinary URLs
//       url: cloudinaryFile.path,
//       thumbnailUrl: cloudinaryFile.path.replace('/upload/', '/upload/w_300,h_300,c_fill/'),
//       downloadUrl: cloudinaryFile.path.replace('/upload/', '/upload/fl_attachment/'),

//       // Metadata
//       cloudinaryPublicId: cloudinaryFile.public_id,
//       resourceType: cloudinaryFile.resource_type,
//       uploadDate: new Date(),

//       // For images
//       dimensions: cloudinaryFile.width && cloudinaryFile.height ? {
//         width: cloudinaryFile.width,
//         height: cloudinaryFile.height
//       } : null
//     };

//     // Determine storage category
//     const storageCategory = category || getCategoryFromResourceType(cloudinaryFile.resource_type);

//     // Update user storage in MongoDB
//     const result = await UserStorage.findOneAndUpdate(
//       { userId: userId },
//       {
//         $push: {
//           files: fileDetails,
//           lastUpload: {
//             name: cloudinaryFile.originalname,
//             fileType: cloudinaryFile.format || cloudinaryFile.resource_type
//           }
//         },
//         $inc: {
//           [`${storageCategory}.spaceTaken`]: cloudinaryFile.size,
//           [`${storageCategory}.noOfFiles`]: 1
//         }
//       },
//       { new: true, upsert: true }
//     );

//     res.json({
//       success: true,
//       message: 'File uploaded to Cloudinary successfully',
//       file: fileDetails,
//       storage: result
//     });

//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Helper function to determine category
// function getCategoryFromResourceType(resourceType) {
//   const typeMap = {
//     'image': 'images',
//     'video': 'media',
//     'raw': 'documents',
//     'auto': 'others'
//   };
//   return typeMap[resourceType] || 'others';
// }
