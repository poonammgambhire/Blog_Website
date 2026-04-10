import { useState } from 'react'
import { BlogContext } from './BlogContext'
import API from '../utils/axios'
import { toast } from 'react-toastify'

const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([])
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(false)

  const getAllBlogs = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/blogs')
      setBlogs(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const getBlogById = async (id) => {
    setLoading(true)
    try {
      const { data } = await API.get(`/blogs/${id}`)
      setBlog(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const createBlog = async (blogData) => {
    try {
      const { data } = await API.post('/blogs', blogData)
      setBlogs((prev) => [data, ...prev])
      toast.success('Blog created successfully!')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create blog')
    }
  }

  const updateBlog = async (id, blogData) => {
    try {
      const { data } = await API.put(`/blogs/${id}`, blogData)
      setBlogs((prev) => prev.map((b) => (b._id === id ? data : b)))
      toast.success('Blog updated successfully!')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update blog')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await API.delete(`/blogs/${id}`)
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      toast.success('Blog deleted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete blog')
    }
  }

  const likeBlog = async (id) => {
    try {
      const { data } = await API.put(`/blogs/${id}/like`)
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to like blog')
    }
  }

  const addComment = async (id, text) => {
    try {
      const { data } = await API.post(`/blogs/${id}/comment`, { text })
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment')
    }
  }

  const deleteComment = async (blogId, commentId) => {
    try {
      await API.delete(`/blogs/${blogId}/comment/${commentId}`)
      toast.success('Comment deleted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const searchBlogs = async (q, category) => {
    setLoading(true)
    try {
      const { data } = await API.get(`/blogs/search?q=${q}&category=${category || ''}`)
      setBlogs(data.blogs)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BlogContext.Provider value={{
      blogs, blog, loading,
      getAllBlogs, getBlogById,
      createBlog, updateBlog, deleteBlog,
      likeBlog, addComment, deleteComment,
      searchBlogs,
    }}>
      {children}
    </BlogContext.Provider>
  )
}

export default BlogProvider