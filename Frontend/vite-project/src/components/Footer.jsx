import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-dark text-white mt-20'>
      <div className='mx-8 sm:mx-16 xl:mx-24 py-10'>

        <div className='flex flex-col sm:flex-row items-start justify-between gap-8'>

          {/* Logo & Description */}
          <div className='max-w-xs'>
            <img src={assets.logo_light} alt="QuickBlog" className='h-10 mb-4' />
            <p className='text-gray-400 text-sm leading-relaxed'>
              Your daily dose of knowledge and inspiration.
              Explore insightful articles on technology, lifestyle, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-gray-400 text-sm'>
              <li><Link to='/' className='hover:text-primary transition'>Home</Link></li>
              <li><Link to='/blog' className='hover:text-primary transition'>Blogs</Link></li>
              <li><Link to='/admin' className='hover:text-primary transition'>Admin</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
            <div className='flex gap-4'>
              <img src={assets.facebook_icon} alt="Facebook" className='w-8 cursor-pointer hover:opacity-70 transition' />
              <img src={assets.twitter_icon} alt="Twitter" className='w-8 cursor-pointer hover:opacity-70 transition' />
              <img src={assets.googleplus_icon} alt="Google+" className='w-8 cursor-pointer hover:opacity-70 transition' />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm'>
          <p>© 2025 QuickBlog. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer