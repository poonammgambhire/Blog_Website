import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../utils/axios'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'

const PublicProfile = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/users/${id}`)
        setProfile(data)
        setFollowing(data.followers?.some(f => f._id === user?._id))

        const blogsRes = await API.get(`/blogs?author=${id}`)
        setBlogs(blogsRes.data)
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id, user?._id])

  const handleFollow = async () => {
    if (!user) return toast.error('Please login to follow')
    try {
      await API.put(`/users/${id}/follow`)
      setFollowing(prev => !prev)
      setProfile(prev => ({
        ...prev,
        followers: following
          ? prev.followers.filter(f => f._id !== user._id)
          : [...prev.followers, { _id: user._id, name: user.name }]
      }))
    } catch (err) {
      toast.error('Failed to follow user')
    }
  }

  if (loading) return (
    <div className='flex justify-center py-20'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
    </div>
  )

  if (!profile) return (
    <div className='text-center py-20 text-gray-400'>User not found</div>
  )

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>

        {/* Profile Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>

            {/* Avatar */}
            <div className='w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl shrink-0'>
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} className='w-24 h-24 rounded-full object-cover' />
                : profile.name?.charAt(0).toUpperCase()
              }
            </div>

            {/* Info */}
            <div className='flex-1 text-center sm:text-left'>
              <h1 className='text-2xl font-bold text-gray-800'>{profile.name}</h1>
              {profile.bio && (
                <p className='text-gray-500 text-sm mt-2 max-w-md'>{profile.bio}</p>
              )}

              {/* Stats */}
              <div className='flex justify-center sm:justify-start gap-6 mt-4'>
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>{blogs.length}</p>
                  <p className='text-xs text-gray-400'>Blogs</p>
                </div>
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>{profile.followers?.length || 0}</p>
                  <p className='text-xs text-gray-400'>Followers</p>
                </div>
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>{profile.following?.length || 0}</p>
                  <p className='text-xs text-gray-400'>Following</p>
                </div>
              </div>

              {/* Follow Button */}
              {user && user._id !== id && (
                <button onClick={handleFollow}
                  className={`mt-4 px-6 py-2 rounded-full text-sm font-medium transition ${
                    following
                      ? 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}>
                  {following ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blogs */}
        <div>
          <h2 className='text-xl font-bold text-gray-800 mb-5'>
            Blogs by {profile.name}
          </h2>

          {blogs.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400'>
              <p>No blogs published yet.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {blogs.map((blog) => (
                <Link to={`/blog/${blog._id}`} key={blog._id}
                  className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition'>
                  <img src={blog.image} alt={blog.title}
                    className='w-full h-44 object-cover' />
                  <div className='p-4'>
                    <span className='text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                      {blog.category}
                    </span>
                    <h3 className='font-semibold text-gray-800 mt-2 mb-1 line-clamp-2'>
                      {blog.title}
                    </h3>
                    <p className='text-gray-500 text-xs line-clamp-2'>
                      {blog.excerpt || blog.description}
                    </p>
                    <p className='text-gray-400 text-xs mt-2'>
                      {new Date(blog.createdAt).toDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default PublicProfile