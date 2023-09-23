const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const userController = require("../Controllers/User");

const router = express.Router();

// ADMIN
router.get("/me", isAuth, userController.getMe);
router.post("/update-admin", isAuth, userController.updateAdmin);
router.get("/get-users-admin", isAuth, userController.getUsersAdmin);
router.get(
  "/get-single-user-admin/:id",
  isAuth,
  userController.getSingleUserAdmin
);
router.get(
  "/handle-user-block-status-admin/:id",
  isAuth,
  userController.handleBlockStatusAdmin
);
router.post("/change-user-approval/:id", isAuth, userController.handleApproval);

module.exports = router;
