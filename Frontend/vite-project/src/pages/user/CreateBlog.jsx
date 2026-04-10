import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blog_categories } from '../../assets/assets'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'

const CreateBlog = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return toast.error('Please upload a thumbnail image')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('description', description)
      formData.append('content', content)
      formData.append('image', image)
      formData.append('status', isPublished ? 'published' : 'draft')

      await API.post('/blogs', formData)
      toast.success('Blog published successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>

        <PageHeader
          title='Write New Blog'
          subtitle='Share your thoughts with the world.'
        />

        <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>

          {/* Thumbnail */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Thumbnail Image</label>
            <label htmlFor='image' className='cursor-pointer'>
              <div className='w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-violet-300 transition-all duration-200 overflow-hidden'>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt='preview' className='h-full w-full object-cover rounded-2xl' />
                ) : (
                  <div className='text-center'>
                    <p className='text-4xl text-gray-300 mb-2'>+</p>
                    <p className='text-sm text-gray-400'>Click to upload image</p>
                    <p className='text-xs text-gray-300 mt-1'>JPG, PNG, WEBP supported</p>
                  </div>
                )}
              </div>
            </label>
            <input type='file' id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
          </div>

          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Blog Title</label>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter blog title...' required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition' />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition bg-white'>
              {blog_categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Short Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder='Brief summary shown on blog card...' rows={2} required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 resize-none transition' />
          </div>

          {/* Content */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Blog Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder='Write your full blog content here...' rows={12} required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 resize-none transition' />
          </div>

          {/* Publish Toggle */}
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium text-gray-700'>Publish immediately</span>
            <button type='button' onClick={() => setIsPublished(!isPublished)}
              className={`w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-1 focus:outline-none
                ${isPublished ? 'bg-violet-600' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isPublished ? 'text-violet-600' : 'text-gray-400'}`}>
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button type='submit' disabled={loading}
              className='bg-violet-600 text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all duration-200 disabled:opacity-60'>
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
            <button type='button' onClick={() => navigate('/dashboard')}
              className='border border-gray-200 text-gray-600 px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition duration-200'>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateBlog