const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
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
  { timestamps: true }
);

packageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Package", packageSchema);
