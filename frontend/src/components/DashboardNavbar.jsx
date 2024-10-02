import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

//const API_URL = process.env.REACT_APP_API_URL;

const DashboardNavbar = ({ isAuthenticated, isAdmin }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
           // await axios.post('http://localhost:3000/auth/logout'); // Assuming this is your logout endpoint
            await axios.post('https://13.201.94.103:3000/auth/logout'); // Assuming this is your logout endpoint
            //await axios.post(`${API_URL}/auth/logout`); // Assuming this is your logout endpoint
            navigate('/'); // Redirect to home or login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav>
            <img src="/images/logo.png" alt="CodeQuest Logo" />
            <div>
                {isAuthenticated && isAdmin && (
                    <button className="admin-btn" onClick={() => navigate('/admin')}>Admin</button>
                )}
                {isAuthenticated ? (
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                ) : (
                    <button className="login-btn" onClick={() => navigate('/home')}>Log In</button>
                )}
            </div>
        </nav>
    );
};

export default DashboardNavbar;