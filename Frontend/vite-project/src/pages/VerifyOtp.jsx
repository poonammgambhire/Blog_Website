import React, { useState, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import API from '../utils/axios'

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const inputRefs = useRef([])

  // Email नसेल तर ForgotPassword वर redirect करा
  if (!email) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md text-center'>
          <p className='text-gray-500 text-sm mb-4'>Session expired. Please try again.</p>
          <Link to='/forgot-password' className='text-primary font-medium hover:underline text-sm'>
            Go to Forgot Password
          </Link>
        </div>
      </div>
    )
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasted)) {
      const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
      setOtp(newOtp)
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length < 6) return setError('Please enter the complete 6-digit OTP')
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp: otpCode })
      navigate(`/reset-password/${data.resetToken}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
      // OTP clear करा चुकीच्या attempt नंतर
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    setOtp(['', '', '', '', '', ''])
    try {
      await API.post('/auth/resend-otp', { email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md'>
        <div className='text-center mb-6'>
          <div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-7 h-7 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h4 className='text-2xl font-bold text-gray-800 mb-1'>Verify OTP</h4>
          <p className='text-gray-400 text-sm'>
            We sent a 6-digit code to{' '}
            <span className='font-medium text-gray-600'>{email}</span>
          </p>
        </div>

        {resent && (
          <div className='bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4'>
            ✅ New OTP sent successfully!
          </div>
        )}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-center gap-3'>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className='w-11 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-xl outline-none focus:border-primary transition'
              />
            ))}
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300 disabled:opacity-60'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className='text-center mt-4'>
          <p className='text-gray-400 text-sm'>
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resending}
              className='text-primary font-medium hover:underline disabled:opacity-50'
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        </div>

        <p className='text-center text-gray-400 text-sm mt-3'>
          <Link to='/forgot-password' className='text-primary font-medium hover:underline'>
            ← Change Email
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyOtp