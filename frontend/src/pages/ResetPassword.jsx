import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

// const API_URL = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const { token } = useParams();  // Get the token from the URL

    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      //axios.post('http://localhost:3000/auth/reset-password/'+token, {
      axios.post('http://13.201.94.103:3000/auth/reset-password/'+token, {
      //axios.post(`${API_URL}/auth/reset-password/`+token, {
        password,
      }).then(response => {
        if (response.data.status) {
          navigate('/login');
        }
        console.log(response.data)
      }).catch(err => {
        console.log(err);
      });
    };
  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <label htmlFor='password'>New Password:</label>
        <input type="password" 
        placeholder="*******"
        onChange={(e) => setPassword(e.target.value)} />

        <button type='submit'>Reset</button>
      </form>
    </div>
  )
}

export default ResetPassword
