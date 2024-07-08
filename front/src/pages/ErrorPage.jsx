import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <section className='error-page'>
    <div className='center'>
    <Link to="/" className='btn primary'>Go back Home</Link>
    <h2>Page Not found</h2>
    </div>
    </section>
  )
}

export default ErrorPage
