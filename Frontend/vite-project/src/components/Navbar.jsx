import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import useAuth from '../hooks/useAuth'


const getAvatar = (avatar, name) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=7c3aed&color=fff&size=80`
  if (!avatar || 
      avatar.includes('via.placeholder.com') || 
      avatar.includes('gravatar.com'))
    return fallback
  return avatar
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className='flex items-center justify-between px-6 sm:px-10 py-3'>

        {/* Logo */}
        <Link to='/' className='flex-shrink-0'>
          <img src={assets.logo} alt='QuickBlog' className='h-9' />
        </Link>

        {/* Desktop Nav */}
        <div className='hidden sm:flex items-center gap-3'>
          {user ? (
            <>
              <div className='flex items-center gap-2 mr-1'>
                {/* ✅ getAvatar वापरला */}
                <img
                  src={getAvatar(user.avatar, user.name)}
                  alt={user.name}
                  className='w-8 h-8 rounded-full object-cover border-2 border-purple-100'
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=80`
                  }}
                />
                <span className='text-sm text-gray-600 font-medium'>Hi, {user.name.split(' ')[0]}</span>
              </div>

              {user.role === 'admin' ? (
                <Link to='/admin'
                  className='text-sm border border-violet-600 text-violet-600 px-4 py-1.5 rounded-full font-medium hover:bg-violet-600 hover:text-white transition duration-200'>
                  Admin Panel
                </Link>
              ) : (
                <Link to='/dashboard'
                  className='text-sm border border-violet-600 text-violet-600 px-4 py-1.5 rounded-full font-medium hover:bg-violet-600 hover:text-white transition duration-200'>
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className='text-sm bg-violet-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-violet-700 transition duration-200'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/register'
                className='text-sm border border-violet-600 text-violet-600 px-5 py-1.5 rounded-full font-medium hover:bg-violet-600 hover:text-white transition duration-200'>
                Register
              </Link>
              <Link to='/login'
                className='text-sm bg-violet-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-violet-700 transition duration-200'>
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className='sm:hidden p-2 rounded-lg hover:bg-gray-100 transition'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'>
          <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-gray-700 my-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div key={location.pathname} className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-72 border-t border-gray-100' : 'max-h-0'}`}>
        <div className='px-6 py-4 flex flex-col gap-3'>
          {user ? (
            <>
              <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
                {/* ✅ getAvatar */}
                <img
                  src={getAvatar(user.avatar, user.name)}
                  alt={user.name}
                  className='w-10 h-10 rounded-full object-cover border-2 border-purple-100'
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=80`
                  }}
                />
                <div>
                  <p className='text-sm font-semibold text-gray-800'>{user.name}</p>
                  <p className='text-xs text-gray-400'>{user.email}</p>
                </div>
              </div>

              {user.role === 'admin' ? (
                <Link to='/admin' className='text-sm text-violet-600 font-medium py-1'>🛠 Admin Panel</Link>
              ) : (
                <Link to='/dashboard' className='text-sm text-violet-600 font-medium py-1'>📊 Dashboard</Link>
              )}

              <button
                onClick={handleLogout}
                className='text-sm text-left text-red-500 font-medium py-1'>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/register'
                className='text-center text-sm border border-violet-600 text-violet-600 px-5 py-2 rounded-full font-medium'>
                Register
              </Link>
              <Link to='/login'
                className='text-center text-sm bg-violet-600 text-white px-5 py-2 rounded-full font-medium'>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar