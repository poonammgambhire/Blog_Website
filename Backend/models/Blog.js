import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      maxlength: 300,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/800x400",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
enum: ["Technology", "Startup", "Lifestyle", "Finance", "Travel", "Food", "Health", "Other"],
      default: "Other",
    },

    tags: [String],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Slug auto generate
// ✅ Slug auto generate
blogSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
  }
});


export default mongoose.model("Blog", blogSchema);