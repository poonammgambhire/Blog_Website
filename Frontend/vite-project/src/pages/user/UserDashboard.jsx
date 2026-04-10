import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import API from '../../utils/axios'

// ── SVG Icons ─────────────────────────────────────────────────────
const PenIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const BlogIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
const ChatIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
const UserIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
const EyeIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const LogoutIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const MenuIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

// ── Stat Card ─────────────────────────────────────────────────────
const StatCard = ({ value, label, color, bg }) => (
  <div className={`${bg} rounded-2xl p-5 flex flex-col items-center justify-center gap-1 border border-gray-100 hover:shadow-md transition-shadow`}>
    <span className={`text-3xl font-bold ${color}`}>{value}</span>
    <span className='text-xs text-gray-500 font-medium uppercase tracking-wide'>{label}</span>
  </div>
)

// ── Main Component ─────────────────────────────────────────────────
const UserDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [myBlogs, setMyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // ✅ profile state — fresh data from server
  const [profile, setProfile] = useState(user)

  useEffect(() => {
    API.get('/blogs/my')
      .then(({ data }) => setMyBlogs(data))
      .catch(console.error)
      .finally(() => setLoading(false))

    // ✅ Latest profile fetch — savedBlogs, followers साठी
    API.get('/auth/profile')
      .then(({ data }) => setProfile(data))
      .catch(console.error)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return
    try {
      await API.delete(`/blogs/${id}`)
      setMyBlogs(prev => prev.filter(b => b._id !== id))
    } catch (err) { console.error(err) }
  }

  const avatarUrl = user?.avatar && !user.avatar.includes('placeholder')
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=7c3aed&color=fff&size=128`

  const totalViews = myBlogs.reduce((acc, b) => acc + (b.views || 0), 0)

  const navItems = [
    { to: '/dashboard/create',   icon: <PenIcon />,   label: 'Write Blog',   accent: true },
    { to: '/dashboard/my-blogs', icon: <BlogIcon />,  label: 'My Blogs'                  },
    { to: '/dashboard/saved',    icon: <SaveIcon />,  label: 'Saved Blogs'               },
    { to: '/dashboard/comments', icon: <ChatIcon />,  label: 'My Comments'               },
    { to: '/dashboard/profile',  icon: <UserIcon />,  label: 'Edit Profile'              },
    { to: `/profile/${user?._id}`,icon: <GlobeIcon />,label: 'Public Profile'            },
  ]

  return (
    <div className='min-h-screen bg-gray-50 flex'>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>

        {/* Brand + User */}
        <div className='px-5 py-6 border-b border-gray-100'>
          <Link to='/' className='flex items-center gap-2 mb-6' onClick={() => setSidebarOpen(false)}>
            <div className='w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>QB</span>
            </div>
            <span className='font-bold text-gray-800 text-sm'>QuickBlog</span>
          </Link>
          <div className='flex items-center gap-3'>
            <img src={avatarUrl} alt={user?.name}
              className='w-10 h-10 rounded-full object-cover ring-2 ring-violet-100 flex-shrink-0'
              onError={e => { e.target.src = avatarUrl }} />
            <div className='min-w-0'>
              <p className='font-semibold text-gray-800 text-sm truncate'>{user?.name}</p>
              <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 space-y-0.5'>
          {navItems.map(({ to, icon, label, accent }) => (
            <Link key={to} to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${accent
                  ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              {icon}
              {label}
              {accent && <span className='ml-auto bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded-full'>New</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className='px-3 py-4 border-t border-gray-100'>
          <button onClick={handleLogout}
            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150'>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-30 bg-black/25 lg:hidden backdrop-blur-sm'
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <main className='flex-1 min-w-0 overflow-auto'>

        {/* Mobile topbar */}
        <div className='lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100'>
          <button onClick={() => setSidebarOpen(true)} className='p-2 rounded-lg hover:bg-gray-100 transition'>
            <MenuIcon />
          </button>
          <span className='font-bold text-gray-800 text-sm'>Dashboard</span>
          <img src={avatarUrl} alt='' className='w-8 h-8 rounded-full object-cover'
            onError={e => { e.target.src = avatarUrl }} />
        </div>

        <div className='px-5 sm:px-8 lg:px-10 py-8 max-w-5xl mx-auto'>

          {/* Greeting */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className='text-gray-400 text-sm mt-1'>Here's a summary of your blog activity.</p>
          </div>

          {/* ── Stats ── */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
            <StatCard value={myBlogs.length}                   label='My Blogs'    color='text-violet-600'  bg='bg-white' />
            <StatCard value={profile?.savedBlogs?.length || 0} label='Saved'       color='text-blue-500'    bg='bg-white' />
            <StatCard value={profile?.followers?.length || 0}  label='Followers'   color='text-emerald-500' bg='bg-white' />
            <StatCard value={totalViews}                       label='Total Views' color='text-amber-500'   bg='bg-white' />
          </div>

          {/* ── Quick Actions ── */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8'>
            {/* Write — big accent card */}
            <Link to='/dashboard/create'
              className='col-span-2 sm:col-span-1 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-2xl p-5 flex flex-col gap-2 transition-all duration-200 shadow-md shadow-violet-200'>
              <PenIcon />
              <span className='font-semibold text-sm'>Write Blog</span>
              <span className='text-violet-200 text-xs'>Share your thoughts</span>
            </Link>

            {[
              { to: '/dashboard/my-blogs', icon: <BlogIcon />, label: 'My Blogs', sub: `${myBlogs.length} total`                          },
              { to: '/dashboard/saved',    icon: <SaveIcon />, label: 'Saved',    sub: `${profile?.savedBlogs?.length || 0} bookmarked`    },
              { to: '/dashboard/comments', icon: <ChatIcon />, label: 'Comments', sub: 'View your replies'                                 },
            ].map(({ to, icon, label, sub }) => (
              <Link key={to} to={to}
                className='bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md active:scale-95 transition-all duration-200 shadow-sm'>
                <span className='text-gray-400'>{icon}</span>
                <span className='font-semibold text-gray-800 text-sm'>{label}</span>
                <span className='text-gray-400 text-xs'>{sub}</span>
              </Link>
            ))}
          </div>

          {/* ── Recent Blogs ── */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>

            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-50'>
              <h2 className='font-semibold text-gray-800 text-sm'>Recent Blogs</h2>
              <Link to='/dashboard/create'
                className='text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition'>
                + Write New
              </Link>
            </div>

            {/* Loading */}
            {loading ? (
              <div className='flex justify-center items-center py-16'>
                <div className='w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin' />
              </div>

            /* Empty */
            ) : myBlogs.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
                <div className='w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 text-3xl'>✍️</div>
                <p className='font-semibold text-gray-700 mb-1'>No blogs yet</p>
                <p className='text-gray-400 text-sm mb-4'>Share your first story with the world</p>
                <Link to='/dashboard/create'
                  className='bg-violet-600 text-white text-sm px-5 py-2 rounded-full hover:bg-violet-700 transition font-medium'>
                  Write your first blog
                </Link>
              </div>

            /* Table */
            ) : (
              <>
                {/* Column headers */}
                <div className='hidden sm:grid grid-cols-12 px-6 py-2 bg-gray-50/70 text-xs font-medium text-gray-400 uppercase tracking-wide'>
                  <span className='col-span-5'>Title</span>
                  <span className='col-span-2'>Category</span>
                  <span className='col-span-2'>Status</span>
                  <span className='col-span-1 text-center'>Views</span>
                  <span className='col-span-2 text-right'>Actions</span>
                </div>

                <div className='divide-y divide-gray-50'>
                  {myBlogs.slice(0, 6).map((blog) => (
                    <div key={blog._id}
                      className='grid grid-cols-12 items-center px-6 py-3.5 hover:bg-gray-50/50 transition-colors gap-y-1'>

                      {/* Title */}
                      <div className='col-span-12 sm:col-span-5 flex items-center gap-3'>
                        {blog.image && !blog.image.includes('placeholder') ? (
                          <img src={blog.image} alt=''
                            className='w-9 h-9 rounded-lg object-cover flex-shrink-0 hidden sm:block' />
                        ) : (
                          <div className='w-9 h-9 rounded-lg bg-violet-50 text-violet-300 flex-shrink-0 items-center justify-center hidden sm:flex'>
                            <BlogIcon />
                          </div>
                        )}
                        <p className='font-medium text-gray-800 text-sm truncate max-w-[160px] sm:max-w-[200px]'>
                          {blog.title}
                        </p>
                      </div>

                      {/* Category */}
                      <div className='col-span-4 sm:col-span-2'>
                        <span className='text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium'>
                          {blog.category}
                        </span>
                      </div>

                      {/* Status */}
                      <div className='col-span-4 sm:col-span-2'>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${blog.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'}`}>
                          {blog.status === 'published' ? '● Live' : '○ Draft'}
                        </span>
                      </div>

                      {/* Views */}
                      <div className='col-span-2 sm:col-span-1 flex items-center justify-end sm:justify-center gap-1 text-xs text-gray-400'>
                        <EyeIcon /> {blog.views || 0}
                      </div>

                      {/* Actions */}
                      <div className='col-span-2 sm:col-span-2 flex items-center justify-end gap-1'>
                        <Link to={`/blog/${blog._id}`}
                          className='p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition' title='View'>
                          <EyeIcon />
                        </Link>
                        <Link to={`/dashboard/edit/${blog._id}`}
                          className='p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition' title='Edit'>
                          <EditIcon />
                        </Link>
                        <button onClick={() => handleDelete(blog._id)}
                          className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition' title='Delete'>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {myBlogs.length > 6 && (
                  <div className='px-6 py-4 border-t border-gray-50 text-center'>
                    <Link to='/dashboard/my-blogs'
                      className='text-violet-600 text-sm font-medium hover:underline'>
                      View all {myBlogs.length} blogs →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard