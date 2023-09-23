const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const coachRoutes = require("../Controllers/Coach");

const router = express.Router();

// ADMIN
router.post("/add-coach", isAuth, coachRoutes.addCoach);
router.get("/get-coaches-admin", isAuth, coachRoutes.getCoachesAdmin);
router.get("/get-single-coach/:id", isAuth, coachRoutes.getSingleCoach);
router.post("/edit-coach", isAuth, coachRoutes.editCoach);
router.get("/get-min", isAuth, coachRoutes.getCoachesMin);

// USER

module.exports = router;
