// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3000/admin/login', { email, password });
//       if (res.data.status === 'success') {
//         navigate('/admin-dashboard'); // Assuming you have an admin dashboard page
//       } else {
//         alert('Invalid credentials');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//     }
//   };

//   return (
//     <div className="admin-login-container">
//       <h2>Admin Login</h2>
//       <form onSubmit={handleLogin}>
//         <label>Email</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//         <label>Password</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;



import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  //  axios.post('http://localhost:3000/auth/login', {
    axios.post('https://13.201.94.103:3000/auth/login', {
    // axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    }).then(response => {
        console.log(response.data);
      if (response.data.status) {
        navigate('/add-problem');
      }
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Admin Log In</h2>

        <label htmlFor='email'>Email:</label>
        <input type='email' autoComplete='off' placeholder='Email'
          onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor='password'>Password:</label>
        <input type="password" placeholder="*******"
          onChange={(e) => setPassword(e.target.value)} />

        <button type='submit'>Login</button>
        {/* <Link to="/forgotPassword">Forgot Password?</Link>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p> */}
      </form>
    </div>
  );
};

export default Login;

