const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const coachSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      required: true,
    },
    sports: {
      type: String,
      required: true,
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

coachSchema.plugin(mongoosePaginate);
coachSchema.index({ "$**": "text" });

module.exports = mongoose.model("Coach", coachSchema);
