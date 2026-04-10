import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect Routes
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // ✅ Blocked user कोणताच protected route access करू शकत नाही
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    // ✅ debug log नाही — sensitive info leak होणार नाही
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// 🛠 Admin Middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};