import { useContext } from 'react'
import { BlogContext } from '../context/BlogContext'
const useBlog = () => useContext(BlogContext)
export default useBlog