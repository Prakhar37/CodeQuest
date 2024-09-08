import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <img src="/images/logo.png" />
      <div className="nav-buttons">
      <Link to="/admin-login">
        <button className="admin-btn">Admin Login</button>
      </Link>
      <Link to="login">
      <button className='login-btn'>Log In</button>
      </Link>
      </div>
    </nav>
  )
}

export default Navbar
