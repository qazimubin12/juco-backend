const fs = require("fs");

const Gallery = require("../Models/Gallery");

exports.addGallery = async (req, res) => {
  try {
    const { title, desc, gallery_type, status } = req.body;
    const media =
      req.files &&
      req.files.media &&
      req.files.media[0] &&
      req.files.media[0].path;
    const gallery = new Gallery({
      title,
      media,
      media_type: req.files.media[0].mimetype,
      desc,
      gallery_type,
      status,
      added_by: req.isAdmin ? "Admin" : req.isCoach ? "Coach" : "User",
      user: req.userId,
    });
    await gallery.save();
    await res.status(201).json({
      message: "Gallery Added",
    });
  } catch (err) {
    const media =
      req.files &&
      req.files.media &&
      req.files.media[0] &&
      req.files.media[0].path;
    if (media) fs.unlink(media, () => {});
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getGalleryAdmin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const role_filter = req.query.role ? { added_by: req.query.role } : {};
    const active_filter = req.query.status ? { status: req.query.status } : {};
    const galleries = await Gallery.paginate(
      {
        ...searchParam,
        ...role_filter,
        ...active_filter,
        gallery_type: req.query.gallery_type,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        popualte: {
          path: "user",
          select: "first_name last_name",
        },
      }
    );
    await res.status(200).json({
      galleries,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    gallery.status = !gallery.status;
    await gallery.save();
    await res.status(201).json({
      message: gallery.status ? "Gallery Unblocked" : "Gallery Blocked",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id).lean();
    await res.status(201).json({
      gallery,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editGallery = async (req, res) => {
  try {
    const { title, desc, status, media, id } = req.body;
    const new_media =
      req.files &&
      req.files.media &&
      req.files.media[0] &&
      req.files.media[0].path;

    const gallery = await Gallery.findById(id);
    gallery.title = title;
    gallery.desc = desc;
    gallery.status = status;
    gallery.media = new_media ? new_media : media;
    gallery.media_type = new_media
      ? req.files.media[0].mimetype
      : gallery.media_type;
    await gallery.save();
    await res.status(201).json({
      message: "Gallery Edited",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
