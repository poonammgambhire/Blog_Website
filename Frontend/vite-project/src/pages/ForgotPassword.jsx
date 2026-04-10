import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/axios'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/forgot-password', { email })
      navigate('/verify-otp', { state: { email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md'>
        <div className='text-center mb-6'>
          <div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-7 h-7 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
          </div>
          <h4 className='text-2xl font-bold text-gray-800 mb-1'>Forgot Password?</h4>
          <p className='text-gray-400 text-sm'>Enter your email and we'll send you a 6-digit OTP</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@email.com'
              required
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300 disabled:opacity-60'
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className='text-center text-gray-400 text-sm mt-5'>
          Remember your password?{' '}
          <Link to='/login' className='text-primary font-medium hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword