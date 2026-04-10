import React from 'react'
import { Link } from 'react-router-dom'

// ← Back arrow icon
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
)

/**
 * Reusable page header for all dashboard sub-pages
 * Usage:
 *   <PageHeader title="My Blogs" subtitle="3 blogs total" action={<button>+ New</button>} />
 */
const PageHeader = ({ title, subtitle, action }) => (
  <div className='mb-8'>
    {/* Back link */}
    <Link
      to='/dashboard'
      className='inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-600 transition-colors duration-150 mb-4 group'
    >
      <span className='group-hover:-translate-x-0.5 transition-transform duration-150'>
        <BackIcon />
      </span>
      Back to Dashboard
    </Link>

    {/* Title row */}
    <div className='flex items-center justify-between gap-4 flex-wrap'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
        {subtitle && <p className='text-gray-400 text-sm mt-0.5'>{subtitle}</p>}
      </div>
      {action && <div className='flex-shrink-0'>{action}</div>}
    </div>
  </div>
)

export default PageHeader