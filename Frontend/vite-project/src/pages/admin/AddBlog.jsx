import React, { useState } from 'react'
import { assets, blog_categories } from '../../assets/assets'
import API from '../../utils/axios'
import { toast } from 'react-toastify'

const AddBlog = () => {
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
      setTitle('')
      setDescription('')
      setContent('')
      setImage(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-3xl'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Add New Blog</h1>
        <p className='text-gray-500 text-sm mt-1'>Fill in the details below to publish a new blog post.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>

        {/* Thumbnail */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Thumbnail Image</label>
          <label htmlFor='image' className='cursor-pointer'>
            <div className='w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition overflow-hidden'>
              {image ? (
                <img src={URL.createObjectURL(image)} alt='preview' className='h-full w-full object-cover rounded-2xl' />
              ) : (
                <div className='text-center'>
                  <img src={assets.upload_area} alt='upload' className='w-10 h-10 mx-auto mb-2 opacity-50' />
                  <p className='text-sm text-gray-400'>Click to upload image</p>
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
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition' />
        </div>

        {/* Category */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition bg-white'>
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
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition' />
        </div>

        {/* Content */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Blog Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder='Write your full blog content here...' rows={10} required
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition' />
        </div>

        {/* Publish Toggle */}
        <div className='flex items-center gap-3'>
          <label className='text-sm font-medium text-gray-700'>Publish immediately</label>
          <div onClick={() => setIsPublished(!isPublished)}
            className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${isPublished ? 'bg-primary' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className='text-sm text-gray-400'>{isPublished ? 'Published' : 'Draft'}</span>
        </div>

        {/* Buttons */}
        <div className='flex gap-3 pt-2'>
          <button type='submit' disabled={loading}
            className='bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300 disabled:opacity-60'>
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
          <button type='button'
            onClick={() => { setTitle(''); setDescription(''); setContent(''); setImage(null) }}
            className='border border-gray-300 text-gray-600 px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition duration-300'>
            Clear
          </button>
        </div>

      </form>
    </div>
  )
}

export default AddBlog