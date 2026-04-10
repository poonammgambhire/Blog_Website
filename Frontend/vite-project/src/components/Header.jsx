import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    const q = inputRef.current?.value?.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className='relative overflow-hidden bg-white'>

      {/* Subtle grid background */}
      <div
        className='absolute inset-0 -z-10 opacity-30'
        style={{
          backgroundImage: `radial-gradient(circle, #d4d0ff 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft purple glow blobs */}
      <div className='absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] -z-10'
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />

      {/* Content */}
      <div className='max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center'>

        {/* Badge */}
        <div className='inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-medium border'
          style={{
            background: 'rgba(124, 58, 237, 0.07)',
            borderColor: 'rgba(124, 58, 237, 0.25)',
            color: '#7c3aed'
          }}>
          <span className='w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse' />
          New: AI-powered writing assistant integrated
        </div>

        {/* Heading */}
        <h1 className='text-4xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight'>
          Write. Share.{' '}
          <span className='relative inline-block'>
            <span style={{ color: '#7c3aed' }}>Inspire.</span>
            {/* Underline decoration */}
            <svg className='absolute -bottom-1 left-0 w-full' height='6' viewBox='0 0 200 6' preserveAspectRatio='none'>
              <path d='M0 5 Q50 0 100 4 Q150 8 200 3' stroke='#7c3aed' strokeWidth='2.5' fill='none' strokeLinecap='round' opacity='0.5' />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p className='mt-5 mb-10 text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed'>
          A space for curious minds. Explore articles on technology, lifestyle, finance and more.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className='flex items-center gap-2 max-w-lg mx-auto bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-violet-400 focus-within:shadow-md'>
          <svg className='w-4 h-4 text-gray-400 ml-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input
            ref={inputRef}
            type='text'
            placeholder='Search blogs, topics, authors...'
            className='flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400 py-0.5'
          />
          <button
            type='submit'
            className='bg-violet-600 text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-violet-700 active:scale-95 transition-all duration-150 flex-shrink-0'>
            Search
          </button>
        </form>

        {/* Quick links */}
        <div className='mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400'>
          <span>Trending:</span>
          {['Technology', 'Finance', 'Lifestyle', 'Travel'].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/search?q=${tag}`)}
              className='px-3 py-1 rounded-full border border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-150 text-gray-500'>
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Header