require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
app.use(cors());

const userRouts = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messageRoutes = require("./routes//messages");
const conversationRoutes = require("./routes/conversation");

const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGO_URL;

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name.toString());
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/users/", userRouts);
app.use("/api/auth/", authRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);

app.get("/", (req, res, next) => {
  res.send("welcome");
});

mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(PORT, () => {
      console.log(`Api Runing on ${PORT}`);
    });
  }
);
