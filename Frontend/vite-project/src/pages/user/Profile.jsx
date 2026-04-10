import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import PageHeader from '../../components/PageHeader'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const avatarUrl = user?.avatar && !user.avatar.includes('placeholder')
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=7c3aed&color=fff&size=128`

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { name, email }
      if (newPassword) payload.password = newPassword

      const { data } = await API.put('/auth/profile', payload)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toast.success('Profile updated!')
      setNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-2xl mx-auto'>

        <PageHeader
          title='Edit Profile'
          subtitle='Update your personal information.'
        />

        {/* Avatar preview */}
        <div className='flex flex-col items-center mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <img
            src={avatarUrl}
            alt={user?.name}
            className='w-20 h-20 rounded-full object-cover ring-4 ring-violet-100 mb-3'
            onError={e => { e.target.src = avatarUrl }}
          />
          <p className='font-semibold text-gray-800'>{user?.name}</p>
          <p className='text-sm text-gray-400'>{user?.email}</p>
          <span className='mt-2 text-xs bg-violet-50 text-violet-600 px-3 py-0.5 rounded-full font-medium capitalize'>
            {user?.role}
          </span>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdateProfile}
          className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5 mb-5'>
          <h2 className='font-semibold text-gray-800 mb-2'>Personal Info</h2>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              New Password{' '}
              <span className='text-gray-400 font-normal'>(optional)</span>
            </label>
            <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Leave blank to keep current password'
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition' />
          </div>

          <button type='submit' disabled={saving}
            className='bg-violet-600 text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all duration-200 disabled:opacity-60'>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Account Info */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <h2 className='font-semibold text-gray-800 mb-4 text-sm'>Account Info</h2>
          <div className='space-y-3'>
            {[
              { label: 'Role',          value: <span className='capitalize font-medium text-gray-800'>{user?.role}</span> },
              { label: 'Member since',  value: <span className='font-medium text-gray-800'>{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> },
              { label: 'Followers',     value: <span className='font-medium text-gray-800'>{user?.followers?.length || 0}</span> },
              { label: 'Following',     value: <span className='font-medium text-gray-800'>{user?.following?.length || 0}</span> },
            ].map(({ label, value }) => (
              <div key={label} className='flex items-center justify-between text-sm'>
                <span className='text-gray-400'>{label}</span>
                {value}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile