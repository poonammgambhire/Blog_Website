import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

avatar: {
  type: String,
  default: "",
},

    bio: {
      type: String, // user about yourself
      maxlength: 300,
    },

    website: {
      type: String, // personal website/portfolio
    },

    social: {
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // kon follow karta hai
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // kon follow ho raha hai
      },
    ],

    savedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog", // bookmark kiye blogs
      },
    ],

    isVerified: {
      type: Boolean,
      default: false, // email verification
    },

    resetPasswordToken: {
      type: String, // forgot password ke liye
    },
    otpCode: {
  type: String,
},
otpExpire: {
  type: Date,
},

    resetPasswordExpire: {
      type: Date,
    },

    isBlocked: {
      type: Boolean,
      default: false, // admin ban kar sakta hai
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);