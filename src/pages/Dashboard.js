// File: src/pages/Dashboard.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import AdminNavbar from './Navbar';

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
    <AdminNavbar Dashboard={Dashboard} />

      {/* Main dashboard content */}
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        {/* ...your widgets and content here... */}
      </div>
    </>
  );
}
