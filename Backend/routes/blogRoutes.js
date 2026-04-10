import express from "express";
import {
  createBlog,
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogById,
  getBlogBySlug,
  getMyBlogs,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment,
  getBlogsByCategory,
  searchBlogs,
} from "../controllers/blogController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Optional auth — token असेल तर user attach करा, नसेल तरी चालेल
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (e) {
    // invalid token असला तरी continue
  }
  next();
};

router.get("/", getAllBlogs);
router.get("/admin/all", protect, adminOnly, getAllBlogsAdmin);
router.get("/search", searchBlogs);
router.get("/my", protect, getMyBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", optionalAuth, getBlogById);   // ✅ optionalAuth add केला
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, addComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);

export default router;