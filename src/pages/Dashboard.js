// File: src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      {/* Top Navigation Bar */}
      <AdminNavbar onLogout={logout} />

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>

        {/* Future dashboard cards/widgets go here */}
        {/* Example Placeholder */}
        {/* <div className="dashboard-widgets">
          <DashboardCard title="Orders" count={123} />
          <DashboardCard title="Revenue" count="₹12,000" />
          <DashboardCard title="Users" count={45} />
        </div> */}
      </div>
    </>
  );
}
