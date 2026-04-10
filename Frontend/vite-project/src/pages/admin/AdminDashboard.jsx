import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios'

// ✅ Typo fix: AdminDasboard → AdminDashboard
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ blogs: 0, comments: 0, published: 0, drafts: 0 })
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, commentsRes] = await Promise.all([
          API.get('/blogs/admin/all'), // ✅ Admin route — drafts + published दोन्ही
          API.get('/comments'),
        ])
        const blogs = blogsRes.data
        const comments = commentsRes.data
        setStats({
          blogs: blogs.length,
          comments: comments.length,
          published: blogs.filter(b => b.status === 'published').length,
          drafts: blogs.filter(b => b.status === 'draft').length, // ✅ आता बरोबर count येईल
        })
        setRecentBlogs(blogs.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Blogs', value: stats.blogs, icon: assets.dashboard_icon_1, bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
    { label: 'Total Comments', value: stats.comments, icon: assets.dashboard_icon_2, bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
    { label: 'Published', value: stats.published, icon: assets.dashboard_icon_3, bg: 'bg-green-50', iconBg: 'bg-green-100' },
    { label: 'Drafts', value: stats.drafts, icon: assets.dashboard_icon_4, bg: 'bg-orange-50', iconBg: 'bg-orange-100' },
  ]

  if (loading) return (
    <div className='flex justify-center py-20'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
    </div>
  )

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
        <p className='text-gray-500 text-sm mt-1'>Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10'>
        {statCards.map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-white shadow-sm`}>
            <div className='flex items-center justify-between mb-4'>
              <div className={`${stat.iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <img src={stat.icon} alt={stat.label} className='w-5 h-5' />
              </div>
            </div>
            <p className='text-3xl font-bold text-gray-800'>{stat.value}</p>
            <p className='text-sm text-gray-500 mt-1'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='font-semibold text-gray-800'>Recent Blogs</h2>
          <button onClick={() => navigate('/admin/listBlog')}
            className='text-primary text-sm font-medium hover:underline'>View all</button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider'>
                <th className='px-6 py-3 font-medium'>Title</th>
                <th className='px-6 py-3 font-medium'>Category</th>
                <th className='px-6 py-3 font-medium'>Date</th>
                <th className='px-6 py-3 font-medium'>Status</th>
                <th className='px-6 py-3 font-medium'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {recentBlogs.map((blog, i) => (
                <tr key={i} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 text-gray-800 font-medium max-w-xs truncate'>{blog.title}</td>
                  <td className='px-6 py-4'>
                    <span className='bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium'>
                      {blog.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-500'>{new Date(blog.createdAt).toDateString()}</td>
                  <td className='px-6 py-4'>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                    }`}>{blog.status}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <button onClick={() => navigate(`/admin/editBlog/${blog._id}`)}
                      className='text-xs text-blue-500 hover:underline'>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard