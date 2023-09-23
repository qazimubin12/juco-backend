const Notification = require("../Models/Notification");

exports.handleReadNotificationAdmin = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    notification.read = true;
    await notification.save();
    await res.status(201).json({
      message: "Notification Marked as Read",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAllNotificationsAdmin = async (req, res) => {
  try {
    const notifications = await Notification.paginate(
      { to: "Admin" },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: { _id: -1 },
      }
    );
    await res.status(200).json({
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getNotificationsCountAdmin = async (req, res) => {
  try {
    const notifications_count = await Notification.find({
      read: false,
      to: "Admin",
    }).countDocuments();
    await res.status(200).json({
      notifications_count,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
