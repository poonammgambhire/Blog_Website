import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }
    const data = await register(formData.name, formData.email, formData.password)
    if (data) navigate('/login')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md'>
        <h4 className='text-center text-2xl font-bold text-gray-800 mb-1'>Create Account</h4>
        <p className='text-center text-gray-400 text-sm mb-6'>Register and start your blogging journey</p>

        {(error || localError) && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4'>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
            <input type='text' name='name' placeholder='Your full name'
              value={formData.name} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
            <input type='email' name='email' placeholder='example@email.com'
              value={formData.email} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input type='password' name='password' placeholder='Min 6 characters'
              value={formData.password} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm Password</label>
            <input type='password' name='confirmPassword' placeholder='Re-enter your password'
              value={formData.confirmPassword} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <button type='submit' disabled={loading}
            className='w-full bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300'>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className='text-center text-gray-400 text-sm mt-5'>
          Already have an account?{' '}
          <Link to='/login' className='text-primary font-medium hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register