import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const BlogCard = ({ blog }) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
      <Link to={`/blog/${blog._id}`} className='no-underline'>
        <div className='rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 group cursor-pointer border border-gray-200 bg-white'>

          <img
            src={blog.image}
            alt={blog.title}
            className='w-full h-48 object-cover group-hover:scale-105 transition duration-500'
          />

          <div className='p-5'>
            <span
              style={{ color: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.08)' }}
              className='text-xs font-medium px-3 py-1 rounded-full'
            >
              {blog.category}
            </span>
            <h3
              style={{ color: '#1a1a2e' }}
              className='font-semibold text-lg mt-3 mb-1 group-hover:text-primary transition duration-300'
            >
              {blog.title}
            </h3>
            <p className='text-gray-500 text-sm mb-3 line-clamp-2'>
        {blog.excerpt || blog.description}
            </p>
            <p className='text-gray-400 text-xs'>
              {new Date(blog.createdAt).toDateString()}
            </p>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}

export default BlogCard