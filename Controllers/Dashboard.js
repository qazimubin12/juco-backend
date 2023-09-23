const User = require("../Models/User");
const Coach = require("../Models/Coach");
const Event = require("../Models/Event");
const SubscriptionLog = require("../Models/SubscriptionLog");

const handleGetUserCount = async (req, res) =>
  await User.find({ userType: "User" }).countDocuments();

const handleGetCoachCount = async (req, res) =>
  await Coach.find().countDocuments();

const handleGetEventCount = async (req, res) =>
  await Event.find().countDocuments();

const handleGetUserSubscribed = async (req, res) => {
  try {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const query = [
      {
        $addFields: {
          date: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: "$package.fee" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ];
    const data = await SubscriptionLog.aggregate(query);
    data.forEach((data) => {
      if (data) arr[data.month - 1] = data.count;
    });
    return arr;
  } catch (err) {
    throw new Error(err.toString());
  }
};

exports.dashboard_stats = async (req, res) => {
  try {
    const users = await handleGetUserCount();
    const events = await handleGetEventCount();
    const coaches = await handleGetCoachCount();
    const graph_data = await handleGetUserSubscribed();

    await res.status(200).json({
      users,
      events,
      coaches,
      graph_data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
