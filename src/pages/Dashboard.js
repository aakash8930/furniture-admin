// File: src/pages/Dashboard.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Navbar with Banner as first tab */}
      <header className="navbar">
        <nav className="navbar__nav">
          <NavLink
            to="/admin/banners"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Banner
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Orders
          </NavLink>
          <button onClick={logout} className="navbar__logout">
            Logout
          </button>
        </nav>
      </header>

      {/* Main dashboard content */}
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        {/* ...your widgets and content here... */}
      </div>
    </>
  );
}
