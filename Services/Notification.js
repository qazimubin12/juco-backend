const Notification = require("../Models/Notification");

module.exports = {
  CreateNotification: async (data) => {
    try {
      const { message, to, userId, payload } = data;

      const notification = new Notification({
        message,
        to,
        userId,
        payload,
      });

      await notification.save();
    } catch (error) {
      console.log(error);
    }
  },
};
