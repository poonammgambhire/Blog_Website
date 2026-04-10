import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blog_categories } from '../../assets/assets'
import API from '../../utils/axios'
import { toast } from 'react-toastify'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existingImage, setExistingImage] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await API.get(`/blogs/${id}`)
        setTitle(data.title)
        setCategory(data.category)
        setDescription(data.description)
        setContent(data.content)
        setIsPublished(data.status === 'published')
        setExistingImage(data.image)
      } catch (err) {
        toast.error('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('description', description)
      formData.append('content', content)
      formData.append('status', isPublished ? 'published' : 'draft')
      if (image) formData.append('image', image)

      await API.put(`/blogs/${id}`, formData)
      toast.success('Blog updated successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className='flex justify-center py-20'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>

        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800'>Edit Blog</h1>
          <p className='text-gray-500 text-sm mt-1'>Update your blog post details below.</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>

          {/* Thumbnail */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Thumbnail Image</label>
            <label htmlFor='image' className='cursor-pointer'>
              <div className='w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition overflow-hidden'>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt='preview' className='h-full w-full object-cover rounded-2xl' />
                ) : existingImage ? (
                  <img src={existingImage} alt='existing' className='h-full w-full object-cover rounded-2xl' />
                ) : (
                  <div className='text-center'>
                    <p className='text-4xl text-gray-300 mb-2'>+</p>
                    <p className='text-sm text-gray-400'>Click to upload new image</p>
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
              rows={2} required
              className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition' />
          </div>

          {/* Content */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Blog Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={10} required
              className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition' />
          </div>

          {/* Publish Toggle */}
          <div className='flex items-center gap-3'>
            <label className='text-sm font-medium text-gray-700'>Published</label>
            <div onClick={() => setIsPublished(!isPublished)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${isPublished ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className='text-sm text-gray-400'>{isPublished ? 'Published' : 'Draft'}</span>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button type='submit' disabled={saving}
              className='bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300 disabled:opacity-60'>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type='button' onClick={() => navigate('/dashboard')}
              className='border border-gray-300 text-gray-600 px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition duration-300'>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditBlog