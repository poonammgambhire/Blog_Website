import Blog from "../models/Blog.js";

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, description, category, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const image = req.file ? req.file.path : "";

    const blog = new Blog({
      title,
      content,
      excerpt: description,
      image,
      category,
      tags,
      status,
      author: req.user._id,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Blogs (Public — published only) + optional ?author= filter
export const getAllBlogs = async (req, res) => {
  try {
    const query = { status: "published" };
    if (req.query.author) query.author = req.query.author;
    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW — Get All Blogs for Admin (published + drafts दोन्ही)
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Single Blog
// ✅ Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar")
      .populate("likes", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    
    const isOwner = req.user && blog.author._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";
    if (blog.status === "draft" && !isOwner && !isAdmin) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Blog by Slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get My Blogs
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.image = req.file ? req.file.path : blog.image;
    blog.excerpt = req.body.description || req.body.excerpt || blog.excerpt;
    blog.category = req.body.category || blog.category;
    blog.tags = req.body.tags || blog.tags;
    blog.status = req.body.status || blog.status;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Like / Unlike Blog
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const alreadyLiked = blog.likes.includes(req.user._id);
    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      blog.likes.push(req.user._id);
    }
    await blog.save();
    res.json({ likes: blog.likes.length, alreadyLiked: !alreadyLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    blog.comments.push({ user: req.user._id, text });
    await blog.save();

    await blog.populate("comments.user", "name avatar");
    res.status(201).json({ message: "Comment added", comments: blog.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    comment.deleteOne();
    await blog.save();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Blogs by Category
export const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({
      category: req.params.category,
      status: "published",
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Search Blogs
export const searchBlogs = async (req, res) => {
  try {
    const { q, category, tags } = req.query;

    let query = { status: "published" };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",") };

    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ count: blogs.length, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};