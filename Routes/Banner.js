const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const bannerRoutes = require("../Controllers/Banner");

const router = express.Router();

// ADMIN
router.post("/add", isAuth, bannerRoutes.create);

// GENERIC
router.get("/get", bannerRoutes.getBanner);

module.exports = router;
