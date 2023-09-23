const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const subscriptionLog = new Schema(
  {
    search_tags: Array,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    package: {
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      fee: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionLog.plugin(mongoosePaginate);
subscriptionLog.index({ "$**": "text" });

module.exports = mongoose.model("SubscriptionLog", subscriptionLog);
