import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import API from '../../utils/axios'
import { toast } from 'react-toastify'

const AdminComments = () => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const { data } = await API.get('/comments')
      setComments(data)
    } catch (err) {
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await API.delete(`/comments/${id}`)
      setComments(prev => prev.filter(c => c._id !== id))
      toast.success('Comment deleted')
    } catch (err) {
      toast.error('Failed to delete comment')
    }
  }

  const toggleApprove = async (id, approved) => {
    try {
      await API.put(`/comments/${id}`, { approved: !approved })
      setComments(prev => prev.map(c => c._id === id ? { ...c, approved: !c.approved } : c))
    } catch (err) {
      toast.error('Failed to update comment')
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
        <h1 className='text-2xl font-bold text-gray-800'>Comments</h1>
        <p className='text-gray-500 text-sm mt-1'>Review and moderate comments from your readers.</p>
      </div>

      <div className='space-y-4'>
        {comments.map((c) => (
          <div key={c._id} className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-start gap-4 flex-1 min-w-0'>
                <div className='w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0'>
                  {c.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap mb-1'>
                    <span className='font-semibold text-gray-800 text-sm'>{c.user?.name || 'Unknown'}</span>
                    <span className='text-gray-400 text-xs'>on</span>
                    <span className='text-primary text-xs font-medium truncate'>{c.blog?.title || 'Blog'}</span>
                    <span className='text-gray-300 text-xs'>•</span>
                    <span className='text-gray-400 text-xs'>{new Date(c.createdAt).toDateString()}</span>
                  </div>
                  <p className='text-gray-600 text-sm leading-relaxed'>{c.text}</p>
                </div>
              </div>

              <div className='flex items-center gap-2 flex-shrink-0'>
                <button onClick={() => toggleApprove(c._id, c.approved)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    c.approved ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  <img src={assets.tick_icon} alt='approve' className='w-3 h-3' />
                  {c.approved ? 'Approved' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(c._id)}
                  className='text-gray-400 hover:text-red-500 transition p-1.5'>
                  <img src={assets.bin_icon} alt='delete' className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className='text-center py-20 text-gray-400'>
            <p className='text-lg'>No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminComments