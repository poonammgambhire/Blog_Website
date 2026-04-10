import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'

const SavedBlogs = () => {
  const [savedBlogs, setSavedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/users/saved/blogs')
      .then(({ data }) => setSavedBlogs(data))
      .catch(() => toast.error('Failed to load saved blogs'))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (blogId) => {
    try {
      await API.put(`/users/blog/${blogId}/save`)
      setSavedBlogs(prev => prev.filter(b => b._id !== blogId))
      toast.success('Blog unsaved!')
    } catch {
      toast.error('Failed to unsave blog')
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
          title='Saved Blogs'
          subtitle={`${savedBlogs.length} blog${savedBlogs.length !== 1 ? 's' : ''} bookmarked`}
        />

        {savedBlogs.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100'>
            <div className='w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 text-3xl'>🔖</div>
            <p className='font-semibold text-gray-700 mb-1'>No saved blogs yet</p>
            <p className='text-gray-400 text-sm mb-4'>Explore blogs and save the ones you love</p>
            <Link to='/blog'
              className='bg-violet-600 text-white text-sm px-5 py-2 rounded-full hover:bg-violet-700 transition font-medium'>
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {savedBlogs.map((blog) => (
              <div key={blog._id}
                className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col'>

                {/* Thumbnail */}
                <div className='h-44 overflow-hidden bg-gray-100 flex-shrink-0'>
                  <img
                    src={blog.image && !blog.image.includes('placeholder') ? blog.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=ede9fe&color=7c3aed&size=400&font-size=0.3`}
                    alt={blog.title}
                    className='w-full h-full object-cover'
                    onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=Blog&background=ede9fe&color=7c3aed&size=400' }}
                  />
                </div>

                {/* Content */}
                <div className='p-4 flex flex-col flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium'>
                      {blog.category}
                    </span>
                    {blog.author?.name && (
                      <span className='text-xs text-gray-400'>by {blog.author.name}</span>
                    )}
                  </div>

                  <h3 className='font-semibold text-gray-800 text-sm mb-1 line-clamp-2 flex-1'>{blog.title}</h3>
                  <p className='text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed'>
                    {blog.excerpt || blog.description || 'No description available.'}
                  </p>

                  <div className='flex items-center justify-between mt-auto pt-3 border-t border-gray-50'>
                    <Link to={`/blog/${blog._id}`}
                      className='text-xs text-violet-600 font-medium hover:underline'>
                      Read More →
                    </Link>
                    <button onClick={() => handleUnsave(blog._id)}
                      className='text-xs text-gray-400 hover:text-red-500 transition font-medium'>
                      Unsave
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedBlogs