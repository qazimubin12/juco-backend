const VideoEditRequest = require("../Models/VideoEditRequest");
const User = require("../Models/User");

exports.create = async (req, res) => {
  try {
    const { video, summary } = req.body;
    const user = await User.findById(req.userId);
    let is_subscribed = false;
    if (
      user.subscriptions.video_editing &&
      user.subscriptions.video_editing.is_subscribed
    )
      is_subscribed = true;
    if (!is_subscribed)
      return res.status(400).json({ message: "Not Subscribed" });
    const videoEditRequest = new VideoEditRequest({
      user: req.userId,
      role: user.userType === "User" ? "Player" : "Coach",
      package: user.subscriptions.video_editing.package,
      status: "Pending",
      search_tags: [user.email, user.first_name, user.last_name, user.userType],
      gallery: video,
      summary,
    });
    await videoEditRequest.save();
    await res.status(201).json({
      message: "Video Edit Request Sent",
    });
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
};

exports.getVideoEditRequests = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const role = req.query.role ? { role: req.query.role } : {};
    const videoEditRequest = await VideoEditRequest.paginate(
      {
        ...searchParam,
        ...role,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        populate: {
          path: "user package",
          select: "first_name last_name userType name title",
        },
      }
    );
    await res.status(200).json({
      videoEditRequest,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleEditRequest = async (req, res) => {
  try {
    const edit_request = await VideoEditRequest.findById(req.params.id)
      .lean()
      .populate({
        path: "user package gallery",
      });
    await res.status(200).json({
      edit_request,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.body;
    const edit_request = await VideoEditRequest.findById(id);
    edit_request.status = status;
    await edit_request.save();
    await res.status(201).json({
      message: "Edit Request Status Changed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
