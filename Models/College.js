const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const collegeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    college_type: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    college_image: {
      type: String,
      required: true,
    },
    tution_in_state: {
      type: String,
      required: true,
    },
    tution_out_of_state: {
      type: String,
      required: true,
    },
    sports: {
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

collegeSchema.plugin(mongoosePaginate);
collegeSchema.index({ "$**": "text" });

module.exports = mongoose.model("College", collegeSchema);
