const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const authController = require("../Controllers/Auth");

const router = express.Router();

// ADMIN
router.post("/admin_register_prvt", authController.signup);
router.post("/login-admin", authController.loginAdmin);
// USER
router.get("/login-user", authController.loginUser);
router.post("/register-user", authController.registerUser);
router.post("/change-password", isAuth, authController.changePassword);
router.post("/recover-password", authController.recoverPassword);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
