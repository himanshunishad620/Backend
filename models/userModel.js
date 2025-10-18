const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  // name: {
  //   type: String,
  //   required: true,
  //   minlength: 4,
  // },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
