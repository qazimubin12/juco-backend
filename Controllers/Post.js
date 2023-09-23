const fs = require("fs");

const Post = require("../Models/Post");

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let thumbnail;
    const media_file =
      req.files &&
      req.files.media_file &&
      req.files.media_file[0] &&
      req.files.media_file[0].path;

    const post = new Post({
      text,
      media_file,
      media_file_type: media_file ? req.files.media_file[0].mimetype : "text",
      thumbnail,
      status: 1,
      user: req.userId,
    });
    await post.save();
    await res.status(201).json({
      message: "Post Created",
      post,
    });
  } catch (err) {
    const media_file =
      req.files &&
      req.files.media_file &&
      req.files.media_file[0] &&
      req.files.media_file[0].path;
    if (media_file) fs.unlink(media_file, () => {});
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const posts = await Post.paginate(
      {
        user: req.query.userId,
        ...searchParam,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        populate: "user",
        select: "-password",
        lean: true,
      }
    );
    await res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.handleBlockPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.status = !post.status;
    await post.save();
    await res.status(201).json({
      message: post.status ? "Post Unblocked" : "Post Blocked",
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
