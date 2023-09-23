const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Routes
const authRoutes = require("./Routes/Auth");
const userRoutes = require("./Routes/User");
const postRoutes = require("./Routes/Post");
const collegeRoutes = require("./Routes/College");
const coachRoutes = require("./Routes/Coach");
const eventRoutes = require("./Routes/Event");
const feedbackRoutes = require("./Routes/Feedback");
const videoEditRequestRoutes = require("./Routes/VideoEditRequest");
const packageRoutes = require("./Routes/Package");
const bannerRoutes = require("./Routes/Banner");
const dashboardRoutes = require("./Routes/Dashboard");
const notificationRoutes = require("./Routes/Notification");
const galleryRoutes = require("./Routes/Gallery");

// Database Connection URI
const MONGO_DATABASE_URI = `mongodb://169.47.198.147/juco-player`;

const PORT = process.env.PORT || 5037;

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".").pop();
    cb(null, uuidv4() + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "user_image" ||
    file.fieldname === "college_image" ||
    file.fieldname === "featured_image"
  ) {
    if (file.mimetype.includes("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "media_file") {
    if (
      file.mimetype.includes("image/") ||
      file.mimetype.includes("video/") ||
      file.mimetype === "application/x-mpegURL"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "media") {
    if (
      file.mimetype.includes("video/") ||
      file.mimetype === "application/x-mpegURL"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};

const app = express();

app.use("/media", express.static(__dirname + "/media"));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: "user_image",
      maxCount: 1,
    },
    {
      name: "media_file",
      maxCount: 1,
    },
    {
      name: "college_image",
      maxCount: 1,
    },
    {
      name: "featured_image",
      maxCount: 1,
    },
    {
      name: "media",
      maxCount: 1,
    },
  ])
);
app.use(bodyParser.json({ limit: "200mb" }));

app.use(helmet());
app.use(logger("dev"));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/video-edit-request", videoEditRequestRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/gallery", galleryRoutes);

mongoose
  .connect(MONGO_DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log(
      "\u001b[" +
        34 +
        "m" +
        `Server started on port: ${PORT} and Connected to Database` +
        "\u001b[0m"
    );

    const server = app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
