const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const videoEditRequestController = require("../Controllers/VideoEditRequest");

const router = express.Router();

// ADMIN
router.get("/get", isAuth, videoEditRequestController.getVideoEditRequests);
router.get("/get/:id", isAuth, videoEditRequestController.getSingleEditRequest);
router.post("/change-status", isAuth, videoEditRequestController.changeStatus);

// USER
router.post("/create", isAuthUser, videoEditRequestController.create);

module.exports = router;
