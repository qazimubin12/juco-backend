const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const galleryController = require("../Controllers/Gallery");

const router = express.Router();

router.post("/create", isAuth, galleryController.addGallery);
router.post("/edit", isAuth, galleryController.editGallery);
router.get("/get-admin", isAuth, galleryController.getGalleryAdmin);
router.get("/toggle-status/:id", isAuth, galleryController.toggleStatus);

// GENERIC
router.get("/get/:id", galleryController.getSingle);

module.exports = router;
