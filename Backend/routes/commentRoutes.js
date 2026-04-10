import express from "express";
import Blog from "../models/Blog.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ "comments.user": req.user._id })
      .populate("comments.user", "name avatar")
      .select("title comments");

    const myComments = [];
    blogs.forEach(blog => {
      blog.comments.forEach(comment => {
     
        if (comment.user?._id?.toString() === req.user._id.toString()) {
          myComments.push({
            _id: comment._id,
            text: comment.text,
            user: comment.user,
            blog: { _id: blog._id, title: blog.title },
            createdAt: comment.createdAt,
          });
        }
      });
    });

    myComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(myComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findOne({ "comments._id": req.params.id });
    if (!blog) return res.status(404).json({ message: "Comment not found" });

    const comment = blog.comments.id(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.comments = blog.comments.filter(
      c => c._id.toString() !== req.params.id
    );
    await blog.save();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get ALL comments (Admin ) — /api/comments
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const blogs = await Blog.find({ "comments.0": { $exists: true } })
      .populate("comments.user", "name avatar")
      .select("title comments");

    const allComments = [];
    blogs.forEach(blog => {
      blog.comments.forEach(comment => {
        allComments.push({
          _id: comment._id,
          text: comment.text,
          user: comment.user,
          blog: { _id: blog._id, title: blog.title },
          createdAt: comment.createdAt,
        });
      });
    });

    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;