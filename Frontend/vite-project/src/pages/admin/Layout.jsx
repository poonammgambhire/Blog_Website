import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import useAuth from '../../hooks/useAuth'

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: assets.dashboard_icon_1, end: true },
  { label: 'Add Blog', path: '/admin/addBlog', icon: assets.add_icon },
  { label: 'Blog List', path: '/admin/listBlog', icon: assets.list_icon },
  { label: 'Comments', path: '/admin/comments', icon: assets.comment_icon },
  { label: 'Users', path: '/admin/manageUsers', icon: assets.dashboard_icon_2 },
]

const Layout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>

      {/* Top Navbar */}
      <header className='flex items-center justify-between px-6 sm:px-10 py-3 bg-white border-b border-gray-200 sticky top-0 z-50'>
        <img src={assets.logo} alt='QuickBlog' className='h-9 cursor-pointer' onClick={() => navigate('/')} />
        <button
          onClick={handleLogout}
          className='bg-primary text-white text-sm px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition duration-300'
        >
          Logout
        </button>
      </header>

      <div className='flex flex-1'>

        {/* Sidebar */}
        <aside className='w-56 bg-white border-r border-gray-200 min-h-full pt-6 hidden sm:block'>
          <nav className='flex flex-col gap-1 px-3'>
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <img src={link.icon} alt={link.label} className='w-5 h-5 opacity-70' />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-6 sm:p-8 overflow-auto'>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default Layout