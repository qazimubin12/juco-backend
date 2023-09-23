const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const eventRoutes = require("../Controllers/Event");

const router = express.Router();

// ADMIN
router.post("/add", isAuth, eventRoutes.addEvent);
router.get("/get-events-admin", isAuth, eventRoutes.getEventsAdmin);
router.get("/get-single-event/:id", isAuth, eventRoutes.getSingleEvent);
router.post("/edit", isAuth, eventRoutes.editEvent);

// USER

module.exports = router;
