// src/components/AdminNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/AdminNavbar.css'; // Optional CSS if needed

const AdminNavbar = ({ logout }) => {
  return (
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
        <button onClick={logout} className="navbar__logout">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default AdminNavbar;
