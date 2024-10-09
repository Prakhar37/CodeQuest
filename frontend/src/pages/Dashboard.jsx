import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import "../App.css";
import ProblemList from "../components/ProblemList";

// const API_URL = process.env.REACT_APP_API_URL;

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
        //const res = await axios.get('http://localhost:3000/auth/verify');
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // const res = await axios.get('http://13.201.94.103:3000/auth/verify');
        //  const res = await axios.get("http://13.201.94.103:3000/auth/verify", {
         const res = await axios.get("https://backend.codeques.site/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // const res = await axios.get(`${API_URL}/auth/verify`);
        console.log("DASHBOARD", res);
        if (res.data.status) {
          setIsAuthenticated(true);
          setIsAdmin(res.data.isAdmin); // Assuming your API returns this info
          fetchUserStats();
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/");
      }
    };

    // // Fetch user statistics
    // const fetchUserStats = async () => {
    //     try {
    //         const solvedRes = await axios.get('http://localhost:3000/user/stats/solved');
    //         const recentRes = await axios.get('http://localhost:3000/user/stats/recent');
    //         const scoreRes = await axios.get('http://localhost:3000/user/stats/score');
    //         setTotalSolved(solvedRes.data.totalProblemsSolved);
    //         setRecentActivities(recentRes.data.recentActivities);
    //         setScore(scoreRes.data.score);
    //     } catch (err) {
    //         console.error('Failed to fetch user stats:', err);
    //     }
    // };

    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        //  const solvedRes = await axios.get('http://localhost:3000/auth/stats/solved');
        const solvedRes = await axios.get(
          // "http://13.201.94.103:3000/auth/stats/solved",
          "https://backend.codeques.site/auth/stats/solved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // const solvedRes = await axios.get(`${API_URL}/auth/stats/solved`);
        //const recentRes = await axios.get('http://localhost:3000/auth/stats/recent');
        const recentRes = await axios.get(
          // "http://13.201.94.103:3000/auth/stats/recent",
          "https://backend.codeques.site/auth/stats/recent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // const recentRes = await axios.get(`${API_URL}/auth/stats/recent`);
        // const scoreRes = await axios.get('http://localhost:3000/auth/stats/score');
        const scoreRes = await axios.get(
          // "http://13.201.94.103:3000/auth/stats/score",
          "https://backend.codeques.site/auth/stats/score",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //const scoreRes = await axios.get(`${API_URL}/auth/stats/score`);
        setTotalSolved(solvedRes.data.totalProblemsSolved);
        setRecentActivities(recentRes.data.recentActivities);
        setScore(scoreRes.data.score);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }
    };

    // Fetch the problems from the backend
    const fetchProblems = async () => {
      try {
        // const res = await axios.get('http://localhost:3000/problems/all'); // Adjust the route according to your API
        // const res = await axios.get("http://13.201.94.103:3000/api/problems/all"); // Adjust the route according to your API
        const res = await axios.get("https://backend.codeques.site/api/problems/all"); // Adjust the route according to your API
        // const res = await axios.get(`${API_URL}/problems/all`); // Adjust the route according to your API
        setProblems(res.data); // Set the list of problems to the state
      } catch (err) {
        console.error("Error fetching problems:", err);
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
            {/* Use 'totalSolved' to display the total problems solved */}
            <div className="stat-item">
              Total Problems Solved: {totalSolved}
            </div>
            <div className="stat-item">Keep Solving!</div>
            {/* Use 'score' to display the user's score */}
            <div className="stat-item">Score: {score}</div>
          </div>
        </section>
        <section className="recent-activities">
          <h2>Recent Problem Solved</h2>
          <ul className="activity-list">
            {/* Use 'recentActivities' to dynamically display the recent activities */}
            {recentActivities.length === 0 ? (
              <li>No recent activities</li>
            ) : (
              recentActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))
            )}
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
