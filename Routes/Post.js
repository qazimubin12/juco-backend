const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const isAuthUser = require("../Middlewares/isAuthUser");
const postController = require("../Controllers/Post");

const router = express.Router();

// ADMIN
router.get("/get-user-posts-admin", isAuth, postController.getUserPosts);
router.get("/handle-block-post/:id", isAuth, postController.handleBlockPost);
// USER
router.post("/create", isAuthUser, postController.createPost);

module.exports = router;
