import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../utils/axios'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'

/* ─── Icon components ─── */
const HeartIcon = ({ filled }) => (
  <svg className='w-5 h-5' fill={filled ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
  </svg>
)
const BookmarkIcon = ({ filled }) => (
  <svg className='w-5 h-5' fill={filled ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z' />
  </svg>
)
const TrashIcon = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
  </svg>
)
const ChatIcon = () => (
  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
  </svg>
)

/* ─── Avatar ─── */
const Avatar = ({ name = '', src, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const [err, setErr] = useState(false)
  // ✅ via.placeholder.com बंद आहे — तो आला तर initials दाखव
const isBroken = !src || err || src.includes('via.placeholder.com') || src.includes('gravatar.com') 
 if (!isBroken) {
    return <img src={src} alt={name} onError={() => setErr(true)}
      className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  )
}

/* ─── Reading Progress Bar ─── */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div className='fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100'>
      <div className='h-full bg-primary transition-all duration-75' style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ─── Scroll-to-top ─── */
const ScrollToTop = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition hover:scale-110'>
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
      </svg>
    </button>
  )
}

/* ─── Sidebar ActionBtn ─── */
const ActionBtn = ({ onClick, active, activeClass, inactiveClass, label, pulse, children }) => (
  <div className='flex flex-col items-center gap-1'>
    <button onClick={onClick}
      className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:scale-110
        ${active ? activeClass : inactiveClass} ${pulse ? 'scale-125' : ''}`}>
      {children}
    </button>
    {label !== undefined && (
      <span className={`text-xs font-semibold ${active ? '' : 'text-gray-400'}`}>{label}</span>
    )}
  </div>
)

/* ─── ShareBtn ─── */
const ShareBtn = ({ onClick, color, small, children }) => (
  <button onClick={onClick}
    className={`${small ? 'w-8 h-8' : 'w-11 h-11'} rounded-full ${color} flex items-center justify-center hover:opacity-85 transition hover:scale-110 shadow-sm`}>
    {children}
  </button>
)

/* WhatsApp SVG */
const WaIcon = () => (
  <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
  </svg>
)
const LinkIcon = () => (
  <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
      d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
  </svg>
)

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const BlogDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const commentRef = useRef(null)

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])

  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likePulse, setLikePulse] = useState(false)
  const [saved, setSaved] = useState(false)

  /* ── Fetch ── */
  useEffect(() => {
    window.scrollTo(0, 0)
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await API.get(`/blogs/${id}`)
        setBlog(data)
        setLikeCount(data.likes?.length || 0)

        if (user) {
          const isLiked = (data.likes || []).some(l =>
            (typeof l === 'object' ? l._id : l)?.toString() === user._id?.toString()
          )
          setLiked(isLiked)

          try {
            const { data: profile } = await API.get('/auth/profile')
            const savedArr = profile.savedBlogs || []
            setSaved(savedArr.some(s =>
              (typeof s === 'object' ? s._id : s)?.toString() === id
            ))
          } catch { /* ignore */ }
        }

        if (data.category) {
          try {
            const { data: rel } = await API.get(`/blogs/category/${data.category}`)
            setRelatedBlogs((rel || []).filter(b => b._id !== id).slice(0, 3))
          } catch { /* ignore */ }
        }
      } catch {
        toast.error('Blog not found')
        navigate('/blog')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, user, navigate])

  /* ── Like ── */
  const handleLike = async () => {
    if (!user) return toast.error('Please login to like')
    const prev = liked
    setLiked(!prev)
    setLikeCount(c => prev ? c - 1 : c + 1)
    setLikePulse(true)
    setTimeout(() => setLikePulse(false), 350)
    try {
      await API.put(`/blogs/${id}/like`)
    } catch {
      setLiked(prev)
      setLikeCount(c => prev ? c + 1 : c - 1)
      toast.error('Failed to like')
    }
  }

  /* ── Save ── */
  const handleSave = async () => {
    if (!user) return toast.error('Please login to save')
    const prev = saved
    setSaved(!prev)
    try {
      const { data } = await API.put(`/users/blog/${id}/save`)
      toast.success(data.message || (!prev ? 'Blog saved!' : 'Removed from saved'))
    } catch {
      setSaved(prev)
      toast.error('Failed to save')
    }
  }

  /* ── Add comment ── */
  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to comment')
    if (!comment.trim()) return
    if (comment.length > 500) return toast.error('Comment too long (max 500 chars)')
    setSubmitting(true)
    try {
      const { data } = await API.post(`/blogs/${id}/comment`, { text: comment.trim() })
      setBlog(prev => ({ ...prev, comments: data.comments }))
      setComment('')
      toast.success('Comment posted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Delete comment ── */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    setDeletingId(commentId)
    try {
      await API.delete(`/blogs/${id}/comment/${commentId}`)
      setBlog(prev => ({ ...prev, comments: prev.comments.filter(c => c._id !== commentId) }))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  /* ── Share ── */
  const share = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const txt = encodeURIComponent(blog?.title || '')
    const map = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${txt}`,
      whatsapp: `https://wa.me/?text=${txt}%20${url}`,
    }
    window.open(map[platform], '_blank', 'noopener,noreferrer')
  }
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  /* ── Derived ── */
  const readingTime = blog ? Math.max(1, Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)) : 1
  const dateStr = blog ? new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : ''

  /* ══ SKELETON ══ */
  if (loading) return (
    <>
      <ReadingProgress />
      <div className='max-w-3xl mx-auto px-6 py-16 animate-pulse space-y-5'>
        <div className='h-3 bg-gray-200 rounded w-1/4' />
        <div className='h-9 bg-gray-200 rounded w-full' />
        <div className='h-9 bg-gray-200 rounded w-4/5' />
        <div className='h-72 bg-gray-200 rounded-2xl mt-4' />
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-3 bg-gray-200 rounded ${i % 4 === 3 ? 'w-3/5' : 'w-full'}`} />
        ))}
      </div>
    </>
  )

  if (!blog) return null

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />

      <article className='min-h-screen bg-white'>

        {/* ── HERO ── */}
        {blog.image ? (
          <div className='relative w-full h-[50vh] sm:h-[62vh] overflow-hidden'>
            <img src={blog.image} alt={blog.title} className='w-full h-full object-cover' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-transparent' />
            <div className='absolute inset-0 flex flex-col justify-end px-6 sm:px-16 xl:px-32 pb-10'>
              <nav className='flex items-center gap-2 text-xs text-white/55 mb-4 tracking-wide'>
                <Link to='/' className='hover:text-white transition'>Home</Link>
                <span>/</span>
                <Link to='/blog' className='hover:text-white transition'>Blog</Link>
                <span>/</span>
                <span className='text-white/80 truncate max-w-[150px] sm:max-w-xs'>{blog.title}</span>
              </nav>
              <span className='self-start text-xs font-bold uppercase tracking-widest bg-primary text-white px-3 py-1 rounded-full mb-4'>
                {blog.category}
              </span>
              <h1 className='text-2xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight max-w-4xl mb-5'>
                {blog.title}
              </h1>
              <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-white/70 text-sm'>
                <Link to={`/profile/${blog.author?._id}`}
                  className='flex items-center gap-2 hover:text-white transition'>
                  <Avatar name={blog.author?.name} src={blog.author?.avatar} size='sm'
                    className='border-2 border-white/30' />
                  <span className='font-medium'>{blog.author?.name}</span>
                </Link>
                <span className='hidden sm:block w-px h-4 bg-white/25' />
                <span>{dateStr}</span>
                <span className='hidden sm:block w-px h-4 bg-white/25' />
                <span className='flex items-center gap-1.5'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  {readingTime} min read
                </span>
                <span className='flex items-center gap-1.5'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  {blog.views} views
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-gradient-to-br from-primary/8 via-violet-50/60 to-white px-6 sm:px-16 xl:px-32 pt-10 pb-12'>
            <nav className='flex items-center gap-2 text-xs text-gray-400 mb-5 tracking-wide'>
              <Link to='/' className='hover:text-primary transition'>Home</Link>
              <span>/</span>
              <Link to='/blog' className='hover:text-primary transition'>Blog</Link>
              <span>/</span>
              <span className='text-gray-600 truncate max-w-[200px]'>{blog.title}</span>
            </nav>
            <span className='inline-block text-xs font-bold uppercase tracking-widest bg-primary text-white px-3 py-1 rounded-full mb-5'>
              {blog.category}
            </span>
            <h1 className='text-3xl sm:text-5xl font-bold text-dark leading-tight max-w-4xl mb-5'>{blog.title}</h1>
            <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-500 text-sm'>
              <Link to={`/profile/${blog.author?._id}`} className='flex items-center gap-2 hover:text-primary transition'>
                <Avatar name={blog.author?.name} src={blog.author?.avatar} size='sm' />
                <span className='font-semibold text-dark'>{blog.author?.name}</span>
              </Link>
              <span>{dateStr}</span>
              <span>{readingTime} min read</span>
              <span>{blog.views} views</span>
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div className='max-w-7xl mx-auto px-6 sm:px-16 xl:px-32 py-10'>
          <div className='flex gap-10 xl:gap-14'>

            {/* ── STICKY SIDEBAR ── */}
            <aside className='hidden lg:flex flex-col items-center gap-5 pt-1 sticky top-16 self-start'>
              <ActionBtn onClick={handleLike} active={liked} pulse={likePulse} label={likeCount}
                activeClass='bg-red-50 border-red-300 text-red-500'
                inactiveClass='border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'>
                <HeartIcon filled={liked} />
              </ActionBtn>
              <ActionBtn onClick={() => commentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                active={false} label={blog.comments?.length || 0}
                activeClass='' inactiveClass='border-gray-200 text-gray-400 hover:border-primary hover:text-primary'>
                <ChatIcon />
              </ActionBtn>
              <ActionBtn onClick={handleSave} active={saved}
                activeClass='bg-primary/10 border-primary text-primary'
                inactiveClass='border-gray-200 text-gray-400 hover:border-primary hover:text-primary'>
                <BookmarkIcon filled={saved} />
              </ActionBtn>
              <div className='w-px h-5 bg-gray-200' />
              <ShareBtn color='bg-blue-600 shadow-blue-200' onClick={() => share('facebook')}>
                <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </ShareBtn>
              <ShareBtn color='bg-sky-500 shadow-sky-200' onClick={() => share('twitter')}>
                <svg className='w-3.5 h-3.5 text-white' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </ShareBtn>
              <ShareBtn color='bg-green-500 shadow-green-200' onClick={() => share('whatsapp')}>
                <WaIcon />
              </ShareBtn>
              <ShareBtn color='bg-gray-100 shadow-gray-100' onClick={copyLink}>
                <LinkIcon />
              </ShareBtn>
            </aside>

            {/* ── ARTICLE CONTENT ── */}
            <div className='flex-1 min-w-0'>

              {blog.excerpt && (
                <p className='text-xl text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 italic font-light'>
                  {blog.excerpt}
                </p>
              )}

              <div className='space-y-5 mb-10'>
                {blog.content?.split('\n\n').filter(p => p.trim()).map((para, i) => (
                  <p key={i} className={`leading-[1.85] ${i === 0 ? 'text-lg font-medium text-dark' : 'text-base text-gray-700'}`}>
                    {para}
                  </p>
                ))}
              </div>

              {blog.tags?.filter(Boolean).length > 0 && (
                <div className='flex flex-wrap items-center gap-2 pt-6 pb-8 border-y border-gray-100'>
                  <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mr-1'>Tags:</span>
                  {blog.tags.filter(Boolean).map((tag, i) => (
                    <span key={i} className='text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition cursor-pointer'>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── MOBILE ACTION BAR ── */}
              <div className='lg:hidden flex flex-wrap items-center gap-2 my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                <button onClick={handleLike}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition ${liked ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-400'}`}>
                  <HeartIcon filled={liked} /> {likeCount}
                </button>
                <button onClick={() => commentRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className='flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary transition'>
                  <ChatIcon /> {blog.comments?.length || 0}
                </button>
                <button onClick={handleSave}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition ${saved ? 'bg-primary/10 text-primary border-primary/30' : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'}`}>
                  <BookmarkIcon filled={saved} /> {saved ? 'Saved' : 'Save'}
                </button>
                <div className='ml-auto flex gap-2'>
                  <ShareBtn small color='bg-sky-500' onClick={() => share('twitter')}>
                    <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                  </ShareBtn>
                  <ShareBtn small color='bg-green-500' onClick={() => share('whatsapp')}>
                    <WaIcon />
                  </ShareBtn>
                  <ShareBtn small color='bg-gray-200' onClick={copyLink}>
                    <svg className='w-3.5 h-3.5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                        d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
                    </svg>
                  </ShareBtn>
                </div>
              </div>

              {/* ── AUTHOR CARD ── */}
              <div className='mt-4 p-6 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-violet-50/40 flex items-start gap-5'>
                <Link to={`/profile/${blog.author?._id}`}>
                  <Avatar name={blog.author?.name} src={blog.author?.avatar} size='lg'
                    className='border-2 border-white shadow-md' />
                </Link>
                <div className='min-w-0'>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Written by</p>
                  <Link to={`/profile/${blog.author?._id}`} className='text-lg font-bold text-dark hover:text-primary transition'>
                    {blog.author?.name}
                  </Link>
                  {blog.author?.bio && (
                    <p className='text-sm text-gray-500 mt-1 line-clamp-2'>{blog.author.bio}</p>
                  )}
                  <Link to={`/profile/${blog.author?._id}`}
                    className='inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 hover:underline'>
                    View all posts →
                  </Link>
                </div>
              </div>

              {/* ── COMMENTS ── */}
              <section ref={commentRef} id='comments' className='mt-12 pt-10 border-t border-gray-100'>
                <h2 className='text-2xl font-bold text-dark mb-7 flex items-center gap-3'>
                  Comments
                  <span className='text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full'>
                    {blog.comments?.length || 0}
                  </span>
                </h2>

                {blog.comments?.length > 0 ? (
                  <div className='space-y-4 mb-10'>
                    {blog.comments.map(c => {
                      const canDelete = user && (
                        (c.user?._id || c.user)?.toString() === user._id?.toString() ||
                        user.role === 'admin'
                      )
                      return (
                        <div key={c._id}
                          className='group flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition'>
                          <Avatar name={c.user?.name} src={c.user?.avatar} size='sm' className='mt-0.5' />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2 mb-2'>
                              <div>
                                <span className='font-semibold text-dark text-sm'>{c.user?.name || 'Anonymous'}</span>
                                <span className='text-gray-400 text-xs ml-3'>
                                  {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              {canDelete && (
                                <button onClick={() => handleDeleteComment(c._id)}
                                  disabled={deletingId === c._id}
                                  className='opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0'
                                  title='Delete'>
                                  {deletingId === c._id
                                    ? <div className='w-4 h-4 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin' />
                                    : <TrashIcon />}
                                </button>
                              )}
                            </div>
                            <p className='text-gray-700 text-sm leading-relaxed'>{c.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='text-center py-14 mb-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
                    <p className='text-4xl mb-3'>💬</p>
                    <p className='font-semibold text-gray-600'>No comments yet</p>
                    <p className='text-sm text-gray-400 mt-1'>Be the first to share your thoughts!</p>
                  </div>
                )}

                <div className='rounded-2xl border border-gray-200 p-6 shadow-sm bg-white'>
                  <h3 className='text-lg font-bold text-dark mb-5'>Leave a comment</h3>
                  {user ? (
                    <form onSubmit={handleComment}>
                      <div className='flex gap-3'>
                        <Avatar name={user.name} src={user.avatar} size='sm' className='mt-0.5 flex-shrink-0' />
                        <div className='flex-1'>
                          <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder={`What do you think, ${user.name?.split(' ')[0]}?`}
                            rows={4}
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition placeholder:text-gray-400'
                          />
                          <div className='flex items-center justify-between mt-3'>
                            <span className={`text-xs ${comment.length > 500 ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                              {comment.length}/500
                            </span>
                            <button type='submit'
                              disabled={submitting || !comment.trim() || comment.length > 500}
                              className='flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                              {submitting
                                ? <><div className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />Posting...</>
                                : 'Post Comment'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className='text-center py-8 bg-gradient-to-br from-gray-50 to-violet-50/40 rounded-xl border border-gray-100'>
                      <p className='text-2xl mb-3'>🔐</p>
                      <p className='font-semibold text-gray-700 mb-1'>Join the conversation</p>
                      <p className='text-sm text-gray-400 mb-5'>Sign in to leave a comment</p>
                      <div className='flex justify-center gap-3'>
                        <Link to='/login' className='bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition'>
                          Login
                        </Link>
                        <Link to='/register' className='border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition'>
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* ── RELATED BLOGS ── */}
              {relatedBlogs.length > 0 && (
                <section className='mt-14 pt-10 border-t border-gray-100'>
                  <h2 className='text-2xl font-bold text-dark mb-6'>
                    More in <span className='text-primary'>{blog.category}</span>
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {relatedBlogs.map(rb => (
                      <Link key={rb._id} to={`/blog/${rb._id}`}
                        className='group rounded-2xl border border-gray-100 overflow-hidden hover:border-primary/30 hover:shadow-md transition duration-300'>
                        {rb.image && (
                          <div className='h-40 overflow-hidden bg-gray-100'>
                            <img src={rb.image} alt={rb.title}
                              className='w-full h-full object-cover group-hover:scale-105 transition duration-500' />
                          </div>
                        )}
                        <div className='p-4'>
                          <span className='text-xs text-primary font-semibold'>{rb.category}</span>
                          <h4 className='font-semibold text-dark text-sm mt-1.5 mb-2 line-clamp-2 group-hover:text-primary transition leading-snug'>
                            {rb.title}
                          </h4>
                          <div className='flex items-center gap-2 text-gray-400 text-xs'>
                            <Avatar name={rb.author?.name} src={rb.author?.avatar} className='!w-5 !h-5 text-[10px]' />
                            <span className='truncate'>{rb.author?.name}</span>
                            <span>·</span>
                            <span>{Math.max(1, Math.ceil((rb.content?.split(/\s+/).length || 0) / 200))} min</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default BlogDetail