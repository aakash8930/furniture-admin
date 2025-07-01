// src/components/AdminNavbar.jsx

import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/AdminNavbar.css';

export default function AdminNavbar() {
  const navigate = useNavigate();

  // Check admin authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <nav className="navbar__nav">
        <div>
          <h1 className='logo'>
            
            Furniture
          </h1>
        </div>
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
          to="/admin/coupon"
          className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
          }
        >
          Coupons
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

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
          }
        >
          Users
        </NavLink>

        <button onClick={handleLogout} className="navbar__logout">
          Logout
        </button>
      </nav>
    </header>
  );
}
