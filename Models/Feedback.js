const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const feedbackEvent = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    form_type: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

feedbackEvent.plugin(mongoosePaginate);
feedbackEvent.index({ "$**": "text" });

module.exports = mongoose.model("Feedback", feedbackEvent);
