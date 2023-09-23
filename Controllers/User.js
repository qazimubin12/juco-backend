const User = require("../Models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    await res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { user_image, first_name, last_name } = req.body;
    let image_to_store;
    const new_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (new_image) image_to_store = new_image;
    else image_to_store = user_image;

    const user = await User.findById(req.userId);
    user.first_name = first_name;
    user.last_name = last_name;
    user.user_image = image_to_store;
    await user.save();
    await res.status(201).json({
      message: "Profile Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getUsersAdmin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const status = req.query.status
      ? { status: parseInt(req.query.status) }
      : {};
    const role = req.query.role ? { role: req.query.role } : {};
    let isApproved = {};
    if (req.query.approved === "Accepted")
      isApproved = { isApproved: "Accepted" };
    else
      isApproved = {
        isApproved: { $ne: "Accepted" },
      };
    const users = await User.paginate(
      {
        userType: "User",
        ...searchParam,
        ...status,
        ...role,
        ...isApproved,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        select: "-password",
        lean: true,
        sort: "-_id",
      }
    );
    await res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().select("-password");
    await res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.handleBlockStatusAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status ? 0 : 1;
    await user.save();
    await res.status(200).json({
      message: "User Block Status Changed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.handleApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    if (
      isApproved !== "Accepted" &&
      isApproved !== "Rejected" &&
      isApproved !== "Pending"
    )
      return res.status(400).json({
        message: "Invalid Status",
      });
    const user = await User.findById(req.params.id);
    if (isApproved === "Accepted") user.status = 1;
    user.isApproved = isApproved;
    await user.save();
    await res.status(200).json({
      message: "User Approval Status Changed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
