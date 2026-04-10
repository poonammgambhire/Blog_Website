import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await login(formData.email, formData.password)
    if (data) {
      data.role === 'admin' ? navigate('/admin') : navigate('/dashboard')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md'>
        <h4 className='text-center text-2xl font-bold text-gray-800 mb-1'>Welcome Back</h4>
        <p className='text-center text-gray-400 text-sm mb-6'>Login to continue your blogging journey</p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
            <input type='email' name='email' placeholder='example@email.com'
              value={formData.email} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input type='password' name='password' placeholder='Enter your password'
              value={formData.password} onChange={handleChange} required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
            <div className='text-right mt-1'>
              <Link to='/forgot-password' className='text-xs text-primary hover:underline'>Forgot password?</Link>
            </div>
          </div>
          <button type='submit' disabled={loading}
            className='w-full bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-gray-400 text-sm mt-5'>
          Don't have an account?{' '}
          <Link to='/register' className='text-primary font-medium hover:underline'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login