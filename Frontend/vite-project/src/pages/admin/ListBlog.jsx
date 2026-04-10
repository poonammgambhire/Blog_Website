import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import { toast } from 'react-toastify'

const ListBlog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data } = await API.get('/blogs')
      setBlogs(data)
    } catch (err) {
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return
    try {
      await API.delete(`/blogs/${id}`)
      setBlogs(prev => prev.filter(b => b._id !== id))
      toast.success('Blog deleted')
    } catch (err) {
      toast.error('Failed to delete blog')
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await API.put(`/blogs/${id}`, { status: newStatus })
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return (
    <div className='flex justify-center py-20'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
    </div>
  )

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Blog List</h1>
        <p className='text-gray-500 text-sm mt-1'>Manage and monitor all your published blog posts.</p>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <p className='text-sm text-gray-500'>{blogs.length} blogs total</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider'>
                <th className='px-6 py-3 font-medium'>#</th>
                <th className='px-6 py-3 font-medium'>Title</th>
                <th className='px-6 py-3 font-medium'>Category</th>
                <th className='px-6 py-3 font-medium'>Date</th>
                <th className='px-6 py-3 font-medium'>Status</th>
                <th className='px-6 py-3 font-medium'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {blogs.map((blog, i) => (
                <tr key={blog._id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 text-gray-400'>{i + 1}</td>
                  <td className='px-6 py-4 text-gray-800 font-medium max-w-xs'>
                    <p className='truncate'>{blog.title}</p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium'>
                      {blog.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-500'>
                    {new Date(blog.createdAt).toDateString()}
                  </td>
                  <td className='px-6 py-4'>
                    <div onClick={() => toggleStatus(blog._id, blog.status)}
                      className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-0.5 ${blog.status === 'published' ? 'bg-green-400' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${blog.status === 'published' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <button onClick={() => navigate(`/admin/editBlog/${blog._id}`)}
                        className='text-xs text-blue-500 hover:underline'>Edit</button>
                      <button onClick={() => handleDelete(blog._id)}
                        className='text-gray-400 hover:text-red-500 transition'>
                        <img src={assets.bin_icon} alt='delete' className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {blogs.length === 0 && (
          <div className='text-center py-16 text-gray-400'>
            <p className='text-lg'>No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListBlog