const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    userType: {
      type: String,
      default: "User",
    },
    subscriptions: {
      subscription_package: {
        package: Object,
        expiry_date: Date,
        is_subscribed: Boolean,
      },
      workout_gallery: {
        package: Object,
        expiry_date: Date,
        is_subscribed: Boolean,
      },
      video_editing: {
        package: Object,
        expiry_date: Date,
        is_subscribed: Boolean,
      },
    },
    sports: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    high_school_graduation_year: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    isApproved: {
      type: String,
      default: "Pending",
    },
    parents_details: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      email_address: {
        type: String,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.index({ "$**": "text" });

module.exports = mongoose.model("User", userSchema);
