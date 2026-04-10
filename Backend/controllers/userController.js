import User from "../models/User.js";
import Blog from "../models/Blog.js";

// ✅ Follow / Unfollow User
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const alreadyFollowing = currentUser.following.includes(req.params.id);

    if (alreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await currentUser.save();
      await userToFollow.save();
      res.json({ message: "Unfollowed successfully" });
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
      await currentUser.save();
      await userToFollow.save();
      res.json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get User Profile (public)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Save / Unsave Blog
export const saveBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blogId = req.params.blogId;

    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.savedBlogs.includes(blogId);

    if (alreadySaved) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId
      );
      await user.save();
      res.json({ message: "Blog unsaved successfully" });
    } else {
      user.savedBlogs.push(blogId);
      await user.save();
      res.json({ message: "Blog saved successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Saved Blogs
export const getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedBlogs",
      populate: {
        path: "author",
        select: "name avatar",
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW — Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await Blog.deleteMany({ author: req.params.id });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW — Update User Role (Admin only) — FIXED
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: "after" }   // ✅ Correct replacement
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `Role updated to ${role}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW — Block / Unblock User (Admin only)
export const toggleBlockUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
