const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    featured_image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.plugin(mongoosePaginate);
eventSchema.index({ "$**": "text" });

module.exports = mongoose.model("Event", eventSchema);
