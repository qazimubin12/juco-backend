const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    media_type: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    gallery_type: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    added_by: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

gallerySchema.plugin(mongoosePaginate);
gallerySchema.index({ "$**": "text" });

module.exports = mongoose.model("Gallery", gallerySchema);
