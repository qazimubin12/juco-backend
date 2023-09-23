const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    coach1: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    desc1: {
      type: String,
      required: true,
    },
    coach2: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    desc2: {
      type: String,
      required: true,
    },
    coach3: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    desc3: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
