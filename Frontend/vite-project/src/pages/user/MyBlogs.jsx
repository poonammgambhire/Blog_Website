import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'

const EyeIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EditIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const BlogIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>

const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/blogs/my')
      .then(({ data }) => setMyBlogs(data))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return
    try {
      await API.delete(`/blogs/${id}`)
      setMyBlogs(prev => prev.filter(b => b._id !== id))
      toast.success('Blog deleted')
    } catch {
      toast.error('Failed to delete blog')
    }
  }

  if (loading) return (
    <div className='flex justify-center items-center py-32'>
      <div className='w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin' />
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-5xl mx-auto'>

        <PageHeader
          title='My Blogs'
          subtitle={`${myBlogs.length} blog${myBlogs.length !== 1 ? 's' : ''} total`}
          action={
            <Link to='/dashboard/create'
              className='bg-violet-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all duration-200'>
              + Write New Blog
            </Link>
          }
        />

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>

          {myBlogs.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center px-6'>
              <div className='w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 text-3xl'>✍️</div>
              <p className='font-semibold text-gray-700 mb-1'>No blogs yet</p>
              <p className='text-gray-400 text-sm mb-4'>Start sharing your thoughts with the world</p>
              <Link to='/dashboard/create'
                className='bg-violet-600 text-white text-sm px-5 py-2 rounded-full hover:bg-violet-700 transition font-medium'>
                Write your first blog
              </Link>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div className='hidden sm:grid grid-cols-12 px-6 py-2.5 bg-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100'>
                <span className='col-span-5'>Title</span>
                <span className='col-span-2'>Category</span>
                <span className='col-span-2'>Status</span>
                <span className='col-span-1 text-center'>Views</span>
                <span className='col-span-2 text-right'>Actions</span>
              </div>

              <div className='divide-y divide-gray-50'>
                {myBlogs.map((blog) => (
                  <div key={blog._id}
                    className='grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50/60 transition-colors gap-y-2'>

                    {/* Title */}
                    <div className='col-span-12 sm:col-span-5 flex items-center gap-3'>
                      {blog.image && !blog.image.includes('placeholder') ? (
                        <img src={blog.image} alt=''
                          className='w-10 h-10 rounded-xl object-cover flex-shrink-0 hidden sm:block' />
                      ) : (
                        <div className='w-10 h-10 rounded-xl bg-violet-50 text-violet-300 flex-shrink-0 items-center justify-center hidden sm:flex'>
                          <BlogIcon />
                        </div>
                      )}
                      <div className='min-w-0'>
                        <p className='font-medium text-gray-800 text-sm truncate'>{blog.title}</p>
                        <p className='text-xs text-gray-400 mt-0.5 sm:hidden'>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className='col-span-4 sm:col-span-2'>
                      <span className='text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium'>
                        {blog.category}
                      </span>
                    </div>

                    {/* Status */}
                    <div className='col-span-4 sm:col-span-2'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${blog.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'}`}>
                        {blog.status === 'published' ? '● Live' : '○ Draft'}
                      </span>
                    </div>

                    {/* Views */}
                    <div className='col-span-2 sm:col-span-1 flex items-center justify-end sm:justify-center gap-1 text-xs text-gray-400'>
                      <EyeIcon /> {blog.views || 0}
                    </div>

                    {/* Actions */}
                    <div className='col-span-2 sm:col-span-2 flex items-center justify-end gap-1'>
                      <Link to={`/blog/${blog._id}`}
                        className='p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition' title='View'>
                        <EyeIcon />
                      </Link>
                      <Link to={`/dashboard/edit/${blog._id}`}
                        className='p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition' title='Edit'>
                        <EditIcon />
                      </Link>
                      <button onClick={() => handleDelete(blog._id)}
                        className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition' title='Delete'>
                        <TrashIcon />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBlogs