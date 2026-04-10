import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  forgotPassword,
   verifyOtp,   
  resendOtp,    
  resetPassword,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUser);
router.get("/users", protect, adminOnly, getAllUsers); // Admin only


router.post("/forgot-password", forgotPassword);     
router.post("/verify-otp", verifyOtp);        
router.post("/resend-otp", resendOtp);         
router.put("/reset-password/:token", resetPassword); 
export default router;