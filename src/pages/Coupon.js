import React, { useEffect, useState } from 'react';
import {
  createCoupon,
  fetchAllCoupons,
  deleteCoupon,
} from '../api/CouponApi';
import '../css/Coupon.css'; // 👈 Import your CSS file
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
<AdminNavbar Coupons={CouponPage} />
    <div className="coupon-container">
      <h2 className="coupon-heading">Create New Coupon</h2>

      <form onSubmit={handleSubmit} className="coupon-form">
        <label>Name</label>
        <input
          type="text"
          name="heading"
          value={form.heading}
          onChange={handleChange}
          placeholder="Coupon Heading"
          className="coupon-input"
          required
        />
                <label>Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Coupon Description"
          className="coupon-input"
          required
        />        <label>Expiry</label>
        <input
          type="datetime-local"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          className="coupon-input"
          required
        />        <label>Use Limit</label>
        <input
          type="number"
          name="usageLimit"
          value={form.usageLimit}
          onChange={handleChange}
          placeholder="Usage Limit"
          className="coupon-input"
        />        <label>Minimum Order Value</label>
        <input
          type="number"
          name="minOrderValue"
          value={form.minOrderValue}
          onChange={handleChange}
          placeholder="Minimum Order Value"
          className="coupon-input"
        />        <label>Discount %</label>
        <input
          type="number"
          name="discountPercent"
          value={form.discountPercent}
          onChange={handleChange}
          placeholder="Discount Percent (%)"
          className="coupon-input"
        />        <label>Discount ₹</label>
        <input
          type="number"
          name="discountAmount"
          value={form.discountAmount}
          onChange={handleChange}
          placeholder="Discount Amount (₹)"
          className="coupon-input"
        />
        <button type="submit" className="coupon-submit-btn">
          Create Coupon
        </button>
      </form>

      <h2 className="coupon-table-heading">Existing Coupons</h2>
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
            {coupons.map((c) => (
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
            ))}
            {coupons.length === 0 && (
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
    </>
  );
};

export default CouponPage;
