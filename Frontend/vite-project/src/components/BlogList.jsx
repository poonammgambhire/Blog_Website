import React, { useState, useEffect } from 'react'
import { blog_categories } from '../assets/assets'
import BlogCard from './BlogCard'
import { motion, AnimatePresence } from 'motion/react'
import API from '../utils/axios'

const BlogList = () => {
  const [menu, setMenu] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await API.get('/blogs')
        setBlogs(data)
      } catch (error) {
        console.error('Blogs fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const filteredBlogs = menu === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === menu)

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 my-10'>
      <div className='flex justify-center gap-6 flex-wrap mb-8'>
        <button onClick={() => setMenu('All')}
          style={menu === 'All' ? { backgroundColor: '#7c3aed' } : {}}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-300 ${menu === 'All' ? 'text-white' : 'text-gray-500 hover:text-primary'}`}>
          All
        </button>
        {blog_categories.map((cat, i) => (
          <button key={i} onClick={() => setMenu(cat)}
            style={menu === cat ? { backgroundColor: '#7c3aed' } : {}}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-300 ${menu === cat ? 'text-white' : 'text-gray-500 hover:text-primary'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filteredBlogs.length === 0 ? (
        <div className='text-center text-gray-400 py-20'>
          <p className='text-lg'>No blogs found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          <AnimatePresence>
            {filteredBlogs.map((blog, index) => (
              <motion.div key={blog._id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default BlogList