const bcrypt = require("bcryptjs");
const fs = require("fs");

const Coach = require("../Models/Coach");

exports.addCoach = async (req, res) => {
  try {
    const { name, email_address, sports, college, password, desc, status } =
      req.body;
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    const is_registered = await Coach.exists({ email_address });
    if (is_registered) {
      if (user_image) fs.unlink(user_image, () => {});
      return res.status(400).json({ message: "Email Already Registered" });
    }
    const hashed_password = await bcrypt.hash(password, 12);
    const coach = new Coach({
      name,
      email_address,
      user_image,
      sports,
      college,
      password: hashed_password,
      desc,
      status,
    });
    await coach.save();
    await res.status(201).json({
      message: "Coach Registered",
    });
    await CreateNotification({
      message: "New Coach Registered",
      to: "Admin",
      payload: {
        payloadType: "New-Coach",
        id: coach._id,
      },
    });
  } catch (err) {
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (user_image) fs.unlink(user_image, () => {});
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getCoachesAdmin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const coaches = await Coach.paginate(
      {
        ...searchParam,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
      }
    );
    await res.status(200).json({
      coaches,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate("college", "name")
      .select("-password");
    await res.status(200).json({
      coach,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editCoach = async (req, res) => {
  try {
    const {
      name,
      email_address,
      sports,
      college,
      desc,
      status,
      user_image,
      id,
    } = req.body;
    const new_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    const coach = await Coach.findById(id);
    coach.name = name;
    coach.email_address = email_address;
    coach.user_image = new_image ? new_image : user_image;
    coach.sports = sports;
    coach.college = college;
    coach.desc = desc;
    coach.status = status;

    await coach.save();
    await res.status(201).json({
      message: "Coach Edited",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getCoachesMin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    let coaches;
    if (!req.query.searchString) {
      coaches = await Coach.paginate(
        {
          status: true,
        },
        {
          page: 1,
          perPage: 10,
          lean: true,
          select: "email_address",
        }
      );
      coaches = coaches.docs;
    } else {
      coaches = await Coach.find({
        ...searchParam,
        status: true,
      })
        .select("email_address")
        .lean();
    }
    await res.status(200).json({
      coaches,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
