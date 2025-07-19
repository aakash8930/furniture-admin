// src/components/AdminNavbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../css/AdminNavbar.css'; // Assuming you have a CSS file for the navbar

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [couponDropdownOpen, setCouponDropdownOpen] = useState(false);
  const couponRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (couponRef.current && !couponRef.current.contains(event.target)) {
        setCouponDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login', { replace: true });
  };

  const handleCouponDropdownClick = (view) => {
    setCouponDropdownOpen(false);
    navigate('/admin/coupon', { state: { view: view } });
  };

  const toggleCouponDropdown = () => {
    setCouponDropdownOpen(prev => !prev);
  };

  const isCouponActive = location.pathname.startsWith('/admin/coupon');

  return (
    <header className="navbar">
      <nav className="navbar__nav">
        <div><h1 className='logo'>Furniture</h1></div>

        <NavLink to="/admin/banners" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Banner</NavLink>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Dashboard</NavLink>
        
        <div className="navbar__dropdown-container" ref={couponRef}>
          <button 
            onClick={toggleCouponDropdown}
            className={`navbar__link navbar__dropdown-toggle ${isCouponActive ? 'navbar__link--active' : ''}`}
          >
            Coupons ▼
          </button>
          {couponDropdownOpen && (
            <div className="navbar__dropdown-menu">
              <a onClick={() => handleCouponDropdownClick('new')}>Make new Coupon</a>
              <a onClick={() => handleCouponDropdownClick('viewAll')}>View Existing Coupons</a>
            </div>
          )}
        </div>

        {/* The Products option is now a direct link */}
        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
          onClick={() => navigate('/admin/products', { state: { view: 'viewAll' }})} // Ensure it defaults to the list view
        >
          Products
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Orders</NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Users</NavLink>

        <button onClick={handleLogout} className="navbar__logout">Logout</button>
      </nav>
    </header>
  );
}
