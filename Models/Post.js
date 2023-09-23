const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    media_file: {
      type: String,
      required: false,
    },
    media_file_type: {
      type: String,
      required: true,
      index: "text",
    },
    thumbnail: String,
    status: {
      type: Boolean,
      default: 1,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);
postSchema.index({ media_file_type: "text" });

module.exports = mongoose.model("Post", postSchema);
