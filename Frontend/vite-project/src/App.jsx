import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { PrivateRoute, AdminRoute } from './utils/PrivateRoute'

import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Search from './pages/Search'
import PublicProfile from './pages/PublicProfile'

import Layout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import AdminComments from './pages/admin/AdminComments'
import AdminEditBlog from './pages/admin/AdminEditBlog'
import ManageUsers from './pages/admin/ManageUsers'

import UserDashboard from './pages/user/UserDashboard'
import CreateBlog from './pages/user/CreateBlog'
import EditBlog from './pages/user/EditBlog'
import MyBlogs from './pages/user/MyBlogs'
import Profile from './pages/user/Profile'
import SavedBlogs from './pages/user/SavedBlogs'
import Comments from './pages/user/Comments'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAuthRoute = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password']
    .some(path => location.pathname.startsWith(path))
  const hideLayout = isAdminRoute || isAuthRoute

  return (
    <div>
      {!hideLayout && <Navbar />}
      <Routes>

        {/* Public */}
        <Route path='/' element={<Home />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
        <Route path='/search' element={<Search />} />
        <Route path='/profile/:id' element={<PublicProfile />} />

        {/* Auth */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />

        {/* User Protected */}
        <Route path='/dashboard' element={
          <PrivateRoute><UserDashboard /></PrivateRoute>
        } />
        <Route path='/dashboard/create' element={
          <PrivateRoute><CreateBlog /></PrivateRoute>
        } />
        <Route path='/dashboard/edit/:id' element={
          <PrivateRoute><EditBlog /></PrivateRoute>
        } />
        <Route path='/dashboard/my-blogs' element={
          <PrivateRoute><MyBlogs /></PrivateRoute>
        } />
        <Route path='/dashboard/profile' element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path='/dashboard/saved' element={
          <PrivateRoute><SavedBlogs /></PrivateRoute>
        } />
        <Route path='/dashboard/comments' element={
          <PrivateRoute><Comments /></PrivateRoute>
        } />

        {/* Admin Protected */}
        <Route path='/admin' element={
          <AdminRoute><Layout /></AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<AdminComments />} />
          <Route path='editBlog/:id' element={<AdminEditBlog />} />
          <Route path='manageUsers' element={<ManageUsers />} />
        </Route>

      </Routes>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App