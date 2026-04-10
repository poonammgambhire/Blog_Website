import React, { useState } from 'react'
import BlogCard from '../components/BlogCard'
import API from '../utils/axios'

const Search = () => {
  const [query, setQuery] = useState('')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await API.get(`/blogs/search?q=${query}`)
      setBlogs(data.blogs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 px-8 py-10'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Search Blogs</h1>

        <form onSubmit={handleSearch} className='flex gap-3 mb-10'>
          <input
            type='text' value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder='Search blogs...'
            className='flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
          />
          <button type='submit'
            className='bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition'>
            Search
          </button>
        </form>

        {loading && (
          <div className='flex justify-center py-10'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
          </div>
        )}

        {!loading && searched && blogs.length === 0 && (
          <p className='text-center text-gray-400'>No blogs found for "{query}"</p>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search