import React, { useState, useEffect } from 'react'
import API from '../../utils/axios'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const ManageUsers = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users')
      setUsers(data)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fix — PUT /users/:id/role (आधी PUT /users/:id होता)
  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      await API.put(`/users/${id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u))
      toast.success(`Role updated to ${newRole}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    }
  }

  // ✅ Fix — DELETE /users/:id (आधी route नव्हता)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their blogs?')) return
    try {
      await API.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  // ✅ NEW — Block/Unblock user
  const toggleBlock = async (id, isBlocked) => {
    try {
      const { data } = await API.put(`/users/${id}/block`)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: data.isBlocked } : u))
      toast.success(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update block status')
    }
  }

  if (loading) return (
    <div className='flex justify-center py-20'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-primary'></div>
    </div>
  )

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Manage Users</h1>
        <p className='text-gray-500 text-sm mt-1'>View and manage all registered users.</p>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <p className='text-sm text-gray-500'>{users.length} users total</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider'>
                <th className='px-6 py-3 font-medium'>#</th>
                <th className='px-6 py-3 font-medium'>Name</th>
                <th className='px-6 py-3 font-medium'>Email</th>
                <th className='px-6 py-3 font-medium'>Role</th>
                <th className='px-6 py-3 font-medium'>Status</th>
                <th className='px-6 py-3 font-medium'>Joined</th>
                <th className='px-6 py-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {users.map((user, i) => {
                // Admin स्वतःवर actions करू शकत नाही
                const isSelf = user._id === currentUser?._id

                return (
                  <tr key={user._id} className={`hover:bg-gray-50 transition ${user.isBlocked ? 'opacity-60' : ''}`}>
                    <td className='px-6 py-4 text-gray-400'>{i + 1}</td>

                    {/* Name */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0'>
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-full object-cover' />
                            : user.name?.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className='font-medium text-gray-800'>{user.name}</p>
                          {isSelf && <p className='text-xs text-primary'>(You)</p>}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className='px-6 py-4 text-gray-500'>{user.email}</td>

                    {/* Role */}
                    <td className='px-6 py-4'>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* ✅ Block Status */}
                    <td className='px-6 py-4'>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className='px-6 py-4 text-gray-500'>
                      {new Date(user.createdAt).toDateString()}
                    </td>

                    {/* Actions */}
                    <td className='px-6 py-4'>
                      {isSelf ? (
                        <span className='text-xs text-gray-400'>—</span>
                      ) : (
                        <div className='flex items-center gap-2 flex-wrap'>
                          {/* Role toggle */}
                          <button
                            onClick={() => toggleRole(user._id, user.role)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                              user.role === 'admin'
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}>
                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                          </button>

                          {/* ✅ Block / Unblock */}
                          <button
                            onClick={() => toggleBlock(user._id, user.isBlocked)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                              user.isBlocked
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            }`}>
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className='text-xs text-red-500 hover:underline'>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className='text-center py-16 text-gray-400'>
            <p className='text-lg'>No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers