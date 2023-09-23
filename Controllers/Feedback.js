const Feedback = require("../Models/Feedback");
const User = require("../Models/User");

exports.addFeedback = async (req, res) => {
  try {
    const { subject, desc } = req.body;
    const user_doc = await User.findById(req.userId);
    const feedback = new Feedback({
      user: req.userId,
      name: `${user_doc.first_name} ${user_doc.last_name}`,
      role: user_doc.userType === "User" ? "Player" : "Coach",
      form_type: "Contact Us",
      desc,
      subject,
      status: "Pending",
    });
    await feedback.save();
    await res.status(201).json({
      message: "Feedback Sent",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const role_filter = req.query.role ? { role: req.query.role } : {};
    const feedbacks = await Feedback.paginate(
      {
        ...searchParam,
        ...role_filter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
      }
    );
    await res.status(200).json({
      feedbacks,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("user", "email")
      .lean();
    await res.status(200).json({
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.changeFeedbackStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (status !== "Ignored" && status !== "Removed") {
      return res.status(400).json({
        message: "Invalid Status Value",
        accepted_values: ["Ignored", "Removed"],
      });
    }
    const feedback = await Feedback.findById(id);
    feedback.status = status;
    await feedback.save();
    await res.status(201).json({
      message: "Feedback Status Changed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
