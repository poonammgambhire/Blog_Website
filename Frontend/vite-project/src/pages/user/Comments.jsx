import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)

const Comments = () => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/comments/my')
      .then(({ data }) => setComments(data))
      .catch(() => toast.error('Failed to load comments'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await API.delete(`/comments/${id}`)
      setComments(prev => prev.filter(c => c._id !== id))
      toast.success('Comment deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  if (loading) return (
    <div className='flex justify-center items-center py-32'>
      <div className='w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin' />
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>

        <PageHeader
          title='My Comments'
          subtitle={`${comments.length} comment${comments.length !== 1 ? 's' : ''} total`}
        />

        {comments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100'>
            <div className='w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 text-3xl'>💬</div>
            <p className='font-semibold text-gray-700 mb-1'>No comments yet</p>
            <p className='text-gray-400 text-sm mb-4'>Start engaging with blogs!</p>
            <Link to='/blog'
              className='bg-violet-600 text-white text-sm px-5 py-2 rounded-full hover:bg-violet-700 transition font-medium'>
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {comments.map((c) => (
              <div key={c._id}
                className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>

                    {/* Blog reference */}
                    <div className='flex items-center gap-2 flex-wrap mb-3'>
                      <span className='text-xs text-gray-400'>Commented on</span>
                      {c.blog?._id ? (
                        <Link to={`/blog/${c.blog._id}`}
                          className='text-violet-600 text-xs font-medium truncate max-w-xs hover:underline'>
                          {c.blog.title || 'Blog'}
                        </Link>
                      ) : (
                        <span className='text-gray-500 text-xs font-medium truncate max-w-xs'>
                          {c.blog?.title || 'Blog'}
                        </span>
                      )}
                      <span className='text-gray-200'>•</span>
                      <span className='text-gray-400 text-xs'>
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Comment text */}
                    <p className='text-gray-700 text-sm leading-relaxed'>{c.text}</p>

                    <div className='mt-2'>
                      <span className='text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-500'>
                        Posted
                      </span>
                    </div>

                  </div>

                  {/* Delete */}
                  <button onClick={() => handleDelete(c._id)}
                    className='p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0 mt-0.5'
                    title='Delete comment'>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Comments