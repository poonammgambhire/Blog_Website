import express from "express";
import {
  followUser,
  getUserById,
  getAllUsers,
  saveBlog,
  getSavedBlogs,
  deleteUser,
  updateUserRole,
  toggleBlockUser,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Specific routes, dynamic routes 
router.get("/", protect, adminOnly, getAllUsers);           // Admin only
router.get("/saved/blogs", protect, getSavedBlogs);
router.put("/blog/:blogId/save", protect, saveBlog);

// ✅ Admin — User manage routes
router.delete("/:id", protect, adminOnly, deleteUser);         // User delete
router.put("/:id/role", protect, adminOnly, updateUserRole);   // Role change
router.put("/:id/block", protect, adminOnly, toggleBlockUser); // Block/Unblock

// ✅ Public / Auth routes — dynamic routes 
router.get("/:id", getUserById);
router.put("/:id/follow", protect, followUser);

export default router;