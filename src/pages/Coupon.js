// src/pages/Coupon.jsx

import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  createCoupon,
  fetchAllCoupons,
  deleteCoupon,
} from '../api/CouponApi';
import '../css/Coupon.css'; // 👈 Scoped styles here
import AdminNavbar from './Navbar';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    heading: '',
    description: '',
    expiryDate: '',
    usageLimit: 1,
    minOrderValue: 0,
    discountPercent: 0,
    discountAmount: 0,
  });

  const loadCoupons = async () => {
    try {
      const data = await fetchAllCoupons();
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(form);
      setForm({
        heading: '',
        description: '',
        expiryDate: '',
        usageLimit: 1,
        minOrderValue: 0,
        discountPercent: 0,
        discountAmount: 0,
      });
      loadCoupons();
      alert('Coupon created successfully');
    } catch (err) {
      console.error('Failed to create coupon', err);
      alert('Error creating coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      loadCoupons();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="coupon-page">
        <div className="coupon-container">
          {/* === Form Section === */}
          <div className="coupon-form-section">
            <h2 className="coupon-heading">🎁 Create New Coupon</h2>

            <form onSubmit={handleSubmit} className="coupon-form">
              {[
                { label: 'Name', name: 'heading', type: 'text', placeholder: 'Coupon Heading' },
                { label: 'Description', name: 'description', type: 'text', placeholder: 'Coupon Description' },
                { label: 'Expiry', name: 'expiryDate', type: 'datetime-local' },
                { label: 'Use Limit', name: 'usageLimit', type: 'number', placeholder: 'Usage Limit' },
                { label: 'Minimum Order Value', name: 'minOrderValue', type: 'number', placeholder: '₹0' },
                { label: 'Discount %', name: 'discountPercent', type: 'number', placeholder: 'e.g. 10%' },
                { label: 'Discount ₹', name: 'discountAmount', type: 'number', placeholder: 'e.g. ₹100' },
              ].map(({ label, name, type, placeholder }) => (
                <div className="form-group" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="coupon-input"
                    required={name !== 'discountAmount'}
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="coupon-submit-btn">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>

          {/* === Table Section === */}
          <div className="coupon-table-section">
            <h2 className="coupon-table-heading">📋 Existing Coupons</h2>
            <div className="coupon-table-wrapper">
              <table className="coupon-table">
                <thead>
                  <tr>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Expiry</th>
                    <th>Limit</th>
                    <th>Min Value</th>
                    <th>% Off</th>
                    <th>₹ Off</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((c) => (
                      <tr key={c._id}>
                        <td>{c.heading}</td>
                        <td>{c.description}</td>
                        <td>{new Date(c.expiryDate).toLocaleString()}</td>
                        <td>{c.usageLimit}</td>
                        <td>₹{c.minOrderValue}</td>
                        <td>{c.discountPercent}%</td>
                        <td>₹{c.discountAmount}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-coupon-row">
                        No coupons created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPage;
