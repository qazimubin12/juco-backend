const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const videoEditRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },
    gallery: {
      type: Schema.Types.ObjectId,
      ref: "Gallery",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    search_tags: Array,
  },
  { timestamps: true }
);

videoEditRequestSchema.plugin(mongoosePaginate);
videoEditRequestSchema.index({ "$**": "text" });

module.exports = mongoose.model("VideoEditRequest", videoEditRequestSchema);
