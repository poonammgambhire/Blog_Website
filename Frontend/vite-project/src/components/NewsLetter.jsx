import React from 'react'

const NewsLetter = () => {
  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 my-16'>
      <div className='bg-primary/10 border border-primary/20 rounded-3xl px-8 py-14 text-center'>

        {/* Heading */}
        <h2 className='text-3xl sm:text-4xl font-bold text-dark mb-3'>
          Never Miss a Blog Post!
        </h2>

        {/* Subheading */}
        <p className='text-gray-500 text-sm max-w-md mx-auto mb-8'>
          Subscribe to our newsletter and get the latest articles, 
          tips and insights delivered directly to your inbox.
        </p>

        {/* Email Input */}
        <form className='flex items-center justify-between max-w-lg mx-auto border border-primary/30 bg-white rounded-full px-4 py-2 shadow-sm'>
          <input
          required
            type='email'
            placeholder='Enter your email address'
            className='w-full outline-none text-sm bg-transparent px-2'
          />
          <button
            type='submit'
            className='bg-primary text-white text-sm px-6 py-2 rounded-full hover:bg-primary/90 transition duration-300 whitespace-nowrap'
          >
            Subscribe
          </button>
        </form>

      </div>
    </div>
  )
}

export default NewsLetter