import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Single Image Upload
router.post("/image", protect, upload.single("image"), (req, res) => {
  try {
    res.json({
      url: req.file?.path,        
      public_id: req.file?.filename || req.file?.public_id, // ✅ multer-storage-cloudinary मध्ये public_id वापरावा
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router; 