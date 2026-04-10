import { useState } from 'react'
import { AuthContext } from './AuthContext'
import API from '../utils/axios'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
<AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout }}>      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider