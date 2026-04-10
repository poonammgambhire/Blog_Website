import React from 'react'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'

const Blog = () => {
  return (
    <div>

      {/* Page Header */}
      <div className='text-center mt-12 mb-4 mx-8 sm:mx-16 xl:mx-24'>
        <h1 className='text-3xl sm:text-4xl font-semibold text-dark mb-3'>
          All <span className='text-primary'>Blog</span> Posts
        </h1>
        <p className='text-gray-500 text-sm max-w-md mx-auto'>
          Browse all our articles across technology, lifestyle, startup, and more.
        </p>
      </div>

      <BlogList />
      <NewsLetter />

    </div>
  )
}

export default Blog