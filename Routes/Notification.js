const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const notificationController = require("../Controllers/Notification");

const router = express.Router();

// ADMIN
router.get("/", isAuth, notificationController.getAllNotificationsAdmin);
router.get("/count", isAuth, notificationController.getNotificationsCountAdmin);
router.get("/read/:id", isAuth, notificationController.handleReadNotificationAdmin);

module.exports = router;
