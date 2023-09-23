const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const collegeRoutes = require("../Controllers/College");

const router = express.Router();

// ADMIN
router.get("/create", collegeRoutes.addCollege);
router.get("/get-colleges-admin", isAuth, collegeRoutes.getCollegesAdmin);
router.get("/get-single-college/:id", collegeRoutes.getSingleCollege);
router.post("/edit-college", isAuth, collegeRoutes.editCollege);
router.get(
  "/get-minified-colleges",
  isAuth,
  collegeRoutes.getMinifiedColleges
);
// USER

module.exports = router;
