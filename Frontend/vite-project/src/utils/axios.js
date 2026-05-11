import axios from 'axios'

const API = axios.create({
  baseURL: 'https://hrm-backend-a7xi.onrender.com/api',
})

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user')
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  }
  return req
})

export default API