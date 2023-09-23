const Package = require("../Models/Package");
const User = require("../Models/User");
const SubscriptionLog = require("../Models/SubscriptionLog");
const moment = require("moment");
const MakePayment = require("../Services/MakePayment");
const { CreateNotification } = require("../Services/Notification");

exports.create = async (req, res) => {
  try {
    const { id, title, desc, duration, fee, type, level } = req.body;
    if (
      type !== "subscription" &&
      type !== "workout gallery" &&
      type !== "video editing"
    )
      return res.status(400).json({
        message: "Invalid Package Type",
      });

    if (id) {
      const package = await Package.findById(id);
      package.title = title;
      package.desc = desc;
      package.duration = duration;
      package.fee = fee;
      package.type = type;
      package.level = level;
      await package.save();
    } else {
      const package = new Package({
        title,
        desc,
        duration,
        fee,
        type,
        level,
      });
      await package.save();
    }

    await res.status(201).json({
      message: id ? "Package Updated" : "Package Created",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const package = await Package.find().lean();
    await res.status(200).json({
      package,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.subscribePackage = async (req, res) => {
  try {
    const {
      package_id,
      card_number,
      card_expiration_month,
      card_expiration_year,
      card_cvv,
    } = req.body;
    const package = await Package.findById(package_id).lean();
    const user = await User.findById(req.userId);
    if (!package)
      return res.status(400).json({ message: "Invalid Package ID" });
    const expiry_date = moment(new Date())
      .add(package.duration, "months")
      .toDate();
    const subscription = new SubscriptionLog({
      user: req.userId,
      role: user.userType === "User" ? "Player" : "Coach",
      package,
      status: "Active",
      expiry_date,
      search_tags: [user.first_name, user.last_name, user.userType, package],
    });
    const obj = {
      package: package,
      expiry_date,
      is_subscribed: true,
    };
    if (package.type === "subscription")
      user.subscriptions.subscription_package = obj;
    if (package.type === "workout gallery")
      user.subscriptions.workout_gallery = obj;
    if (package.type === "video editing")
      user.subscriptions.video_editing = obj;
    await MakePayment(
      card_number,
      card_expiration_month,
      card_expiration_year,
      card_cvv,
      user.email,
      package_id,
      package.fee
    );
    await subscription.save();
    await user.save();
    await res.status(201).json({
      message: "Package Subscribed",
    });

    await CreateNotification({
      message: "New Subscription",
      to: "Admin",
      payload: {
        payloadType: "Subscription",
        id: subscription._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const role = req.query.role ? { role: req.query.role } : {};
    const from = req.query.from ? req.query.from : null;
    const to = req.query.to ? req.query.to : null;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment(new Date(from)).startOf("day"),
          $lte: moment(new Date(to)).endOf("day"),
        },
      };
    const subscriptionLog = await SubscriptionLog.paginate(
      {
        ...searchParam,
        ...role,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        populate: {
          path: "user",
          select: "first_name last_name",
        },
        lean: true,
      }
    );
    await res.status(200).json({
      logs: subscriptionLog,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getLog = async (req, res) => {
  try {
    const log = await SubscriptionLog.findById(req.params.id).lean().populate({
      path: "user",
      select: "first_name last_name user_image",
    });
    await res.status(200).json({
      log,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
