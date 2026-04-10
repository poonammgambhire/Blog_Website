import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to='/login' />
}

export const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' />
  if (user.role !== 'admin') return <Navigate to='/' />
  return children
}