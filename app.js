const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const otherRoutes = require("./routes/otherRoutes");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://drive-x-frontend-smoky.vercel.app",
      "https://projectdrivex.netlify.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", fileRoutes);
app.use("/api", otherRoutes);

module.exports = app;
