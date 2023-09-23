const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const feedbackController = require("../Controllers/Feedback");

const router = express.Router();

// ADMIN
router.get("/get-feedbacks-admin", isAuth, feedbackController.getFeedbacks);
router.get("/get-single-feedback/:id", isAuth, feedbackController.getSingleFeedback);
router.post("/change-status", isAuth, feedbackController.changeFeedbackStatus);

// USER
router.post("/create", isAuthUser, feedbackController.addFeedback);

module.exports = router;
