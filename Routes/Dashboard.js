const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const { dashboard_stats } = require("../Controllers/Dashboard");

const router = express.Router();

// ADMIN
router.get("/", dashboard_stats);

module.exports = router;
