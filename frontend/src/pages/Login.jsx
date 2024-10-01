import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //axios.post('http://localhost:3000/auth/login', {
    axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    },{withCredentials: true,}).then(response => {
        console.log(response.data);
      if (response.data.status) {
        navigate('/dashboard');
      }
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Log In</h2>

        <label htmlFor='email'>Email:</label>
        <input type='email' autoComplete='off' placeholder='Email'
          onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor='password'>Password:</label>
        <input type="password" placeholder="*******"
          onChange={(e) => setPassword(e.target.value)} />

        <button type='submit'>Login</button>
        <Link to="/forgotPassword">Forgot Password?</Link>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;

