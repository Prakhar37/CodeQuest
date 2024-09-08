import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import '../App.css';
import ProblemList from '../components/ProblemList';

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [totalSolved, setTotalSolved] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const [score, setScore] = useState(0);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get('http://localhost:3000/auth/verify');
                if (res.data.status) {
                    setIsAuthenticated(true);
                    setIsAdmin(res.data.isAdmin); // Assuming your API returns this info
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error verifying user:', error);
                navigate('/');
            }
        };

        // Fetch user statistics
        const fetchUserStats = async () => {
            try {
                const solvedRes = await axios.get('http://localhost:3000/user/stats/solved');
                const recentRes = await axios.get('http://localhost:3000/user/stats/recent');
                const scoreRes = await axios.get('http://localhost:3000/user/stats/score');
                setTotalSolved(solvedRes.data.totalProblemsSolved);
                setRecentActivities(recentRes.data.recentActivities);
                setScore(scoreRes.data.score);
            } catch (err) {
                console.error('Failed to fetch user stats:', err);
            }
        };

        // Fetch the problems from the backend
        const fetchProblems = async () => {
            try {
                const res = await axios.get('http://localhost:3000/problems/all'); // Adjust the route according to your API
                setProblems(res.data); // Set the list of problems to the state
            } catch (err) {
                console.error('Error fetching problems:', err);
            }
        };

        verifyUser();
        fetchProblems(); // Call fetchProblems to get the problems
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <DashboardNavbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
            <div className="dashboard-content">
                <section className="overview">
                    <h2>Overview</h2>
                    <div className="overview-stats">
                        <div className="stat-item">Total Problems Solved: 120</div>
                        <div className="stat-item">Keep Solving!</div>
                        <div className="stat-item">Score: 2500</div>
                    </div>
                </section>
                <section className="recent-activities">
                    <h2>Recent Activities</h2>
                    <ul className="activity-list">
                        <li>Solved Problem A</li>
                        <li>Solved Problem B</li>
                    </ul>
                </section>
                <section className="problem-list">
                    <h2>Problem List</h2>
                   {/* Passing the fetched problems to the ProblemList component */}
                   <ProblemList problems={problems} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;


