const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const packageController = require("../Controllers/Package");

const router = express.Router();

// ADMIN
router.post("/create", isAuth, packageController.create);
router.get("/get-logs", isAuth, packageController.getSubscriptions);
router.get("/get-log/:id", isAuth, packageController.getLog);

// GENERAL
router.get("/get", packageController.getPackages);

// USER
router.post("/subscribe", isAuthUser, packageController.subscribePackage);

module.exports = router;
