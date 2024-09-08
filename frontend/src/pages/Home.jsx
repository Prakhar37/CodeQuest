import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
    // const navigate = useNavigate()
    // const handleLogout = () => {
    //     axios.get('http://localhost:3000/auth/logout')
    //     .then(res => {
    //         if(res.data.status) {
    //             navigate('/login')
    //         }
    //     }).catch(err=> {
    //         console.log(err)
    //     })
    // }
  return (
    <div className='home'>
      {/* <button><Link to="/dashboard">Dashboard</Link></button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button> */}
      <Navbar/>
      <img src="/images/slogan.png" />

    </div>
  )
}

export default Home
