// src/pages/Coupon.jsx

import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  createCoupon,
  fetchAllCoupons,
  updateCoupon,
  deleteCoupon,
} from '../api/CouponApi';
import AdminNavbar from './Navbar';
import '../css/Coupon.css';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);

  // Form state for creating a new coupon
  const [form, setForm] = useState({
    code: '',
    heading: '',
    description: '',
    expiryDate: '',
    usageLimit: 1,
    minOrderValue: 0,
    discountPercent: 0,
    discountAmount: 0,
    visible: true,
    assignedTo: '' // ← new field
  });

  // Editing state (for when the admin clicks “Edit”)
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    code: '',
    heading: '',
    description: '',
    expiryDate: '',
    usageLimit: 1,
    minOrderValue: 0,
    discountPercent: 0,
    discountAmount: 0,
    visible: true,
    assignedTo: '' // ← new field
  });

  const adminToken = localStorage.getItem('adminToken');

  // Load coupons from server
  const loadCoupons = async () => {
    try {
      if (!adminToken) throw new Error('Not authenticated as admin');
      const data = await fetchAllCoupons(adminToken);
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
      alert(err.message || 'Could not load coupons.');
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Handle form input changes (both create mode and edit mode)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (editingId) {
      // Editing mode
      setEditedData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    } else {
      // Create mode
      setForm((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
  };

  // Generate a random 8-character coupon code
  const generateCode = () => {
    const newCode = nanoid(8).toUpperCase();
    if (editingId) {
      setEditedData((prev) => ({ ...prev, code: newCode }));
    } else {
      setForm((prev) => ({ ...prev, code: newCode }));
    }
  };

  // Create a new coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!adminToken) throw new Error('Not authenticated as admin');

      const payload = {
        code: form.code.trim().toUpperCase(),
        heading: form.heading,
        description: form.description,
        expiryDate: new Date(form.expiryDate).toISOString(),
        usageLimit: Number(form.usageLimit),
        minOrderValue: Number(form.minOrderValue),
        discountPercent: Number(form.discountPercent),
        discountAmount: Number(form.discountAmount),
        visible: form.visible,
        assignedTo: form.assignedTo.trim() || null // if empty, send null
      };

      await createCoupon(adminToken, payload);
      // Reset form
      setForm({
        code: '',
        heading: '',
        description: '',
        expiryDate: '',
        usageLimit: 1,
        minOrderValue: 0,
        discountPercent: 0,
        discountAmount: 0,
        visible: true,
        assignedTo: ''
      });
      loadCoupons();
      alert('Coupon created successfully');
    } catch (err) {
      console.error('Failed to create coupon', err);
      alert(err.response?.data?.error || err.message || 'Error creating coupon');
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      if (!adminToken) throw new Error('Not authenticated as admin');
      await deleteCoupon(adminToken, id);
      loadCoupons();
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.error || err.message || 'Error deleting coupon');
    }
  };

  // Start editing a coupon (populate editedData)
  const startEdit = (coupon) => {
    setEditingId(coupon._id);
    setEditedData({
      code: coupon.code,
      heading: coupon.heading,
      description: coupon.description,
      expiryDate: coupon.expiryDate.slice(0, 16), // for <input type="datetime-local">
      usageLimit: coupon.usageLimit,
      minOrderValue: coupon.minOrderValue,
      discountPercent: coupon.discountPercent,
      discountAmount: coupon.discountAmount,
      visible: coupon.visible,
      assignedTo: coupon.assignedTo || '' // show existing UID (or empty)
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditedData({
      code: '',
      heading: '',
      description: '',
      expiryDate: '',
      usageLimit: 1,
      minOrderValue: 0,
      discountPercent: 0,
      discountAmount: 0,
      visible: true,
      assignedTo: ''
    });
  };

  // Save edited coupon
  const saveEdit = async (id) => {
    try {
      if (!adminToken) throw new Error('Not authenticated as admin');

      const payload = {
        code: editedData.code.trim().toUpperCase(),
        heading: editedData.heading,
        description: editedData.description,
        expiryDate: new Date(editedData.expiryDate).toISOString(),
        usageLimit: Number(editedData.usageLimit),
        minOrderValue: Number(editedData.minOrderValue),
        discountPercent: Number(editedData.discountPercent),
        discountAmount: Number(editedData.discountAmount),
        visible: editedData.visible,
        assignedTo: editedData.assignedTo.trim() || null
      };

      await updateCoupon(adminToken, id, payload);
      setEditingId(null);
      loadCoupons();
      alert('Coupon updated successfully');
    } catch (err) {
      console.error('Failed to update coupon', err);
      alert(err.response?.data?.error || err.message || 'Error updating coupon');
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="coupon-page">
        <div className="coupon-container">
          {/* === CREATE / EDIT FORM SECTION === */}
          <div className="coupon-form-section">
            <h2 className="coupon-heading">
              {editingId ? '✏️ Edit Coupon' : '🎁 Create New Coupon'}
            </h2>

            <form
              onSubmit={
                editingId
                  ? (e) => {
                    e.preventDefault();
                    saveEdit(editingId);
                  }
                  : handleSubmit
              }
              className="coupon-form"
            >
              {/* Code input + generate button */}
              <div className="form-group code-group">
                <label htmlFor="code">Code</label>
                <div className="code-input-wrapper">
                  <input
                    id="code"
                    type="text"
                    name="code"
                    value={editingId ? editedData.code : form.code}
                    onChange={handleChange}
                    placeholder="Enter or generate code"
                    className="coupon-input code-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="generate-btn"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {[
                {
                  label: 'Name',
                  name: 'heading',
                  type: 'text',
                  placeholder: 'Coupon Heading',
                },
                {
                  label: 'Description',
                  name: 'description',
                  type: 'text',
                  placeholder: 'Coupon Description',
                },
                { label: 'Expiry', name: 'expiryDate', type: 'datetime-local' },
                {
                  label: 'Use Limit',
                  name: 'usageLimit',
                  type: 'number',
                  placeholder: 'Usage Limit',
                },
                {
                  label: 'Minimum Order Value',
                  name: 'minOrderValue',
                  type: 'number',
                  placeholder: '0',
                },
                {
                  label: 'Discount %',
                  name: 'discountPercent',
                  type: 'number',
                  placeholder: 'e.g. 10',
                },
                {
                  label: 'Discount ₹',
                  name: 'discountAmount',
                  type: 'number',
                  placeholder: 'e.g. 100',
                },
              ].map(({ label, name, type, placeholder }) => (
                <div className="form-group" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={editingId ? editedData[name] : form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="coupon-input"
                    required={name !== 'discountAmount'}
                  />
                </div>
              ))}

              {/* New “Assign To” field (admin pastes a Firebase UID) */}
              <div className="form-group">
                <label htmlFor="assignedTo">Assign To (UID)</label>
                <input
                  id="assignedTo"
                  type="text"
                  name="assignedTo"
                  value={editingId ? editedData.assignedTo : form.assignedTo}
                  onChange={handleChange}
                  placeholder="Leave blank if public"
                  className="coupon-input"
                />
                <small style={{ color: '#555', marginTop: '4px', display: 'block' }}>
                  If visible=false, only this user’s UID can apply the coupon.
                </small>
              </div>

              {/* Visible checkbox */}
              <div className="form-group checkbox-group">
                <label htmlFor="visible">Visible</label>
                <input
                  id="visible"
                  type="checkbox"
                  name="visible"
                  checked={editingId ? editedData.visible : form.visible}
                  onChange={handleChange}
                />
                <small style={{ color: '#555', marginTop: '4px', display: 'block' }}>
                  Uncheck to make this coupon private (must set “Assign To” UID).
                </small>
              </div>

              <div className="form-actions">
                {editingId ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(editingId)}
                      className="coupon-submit-btn"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="cancel-btn"

                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="submit" className="coupon-submit-btn">
                    Create Coupon
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* === TABLE SECTION === */}
          <div className="coupon-table-section">
            <h2 className="coupon-table-heading">📋 Existing Coupons</h2>
            <div className="coupon-table-wrapper">
              <table className="coupon-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Heading</th>
                    <th>Description</th>
                    <th>Expiry</th>
                    <th>Limit</th>
                    <th>Min Value</th>
                    <th>% Off</th>
                    <th>₹ Off</th>
                    <th>Visible</th>
                    <th>Assigned To</th> {/* ← New column */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((c) => (
                      <tr key={c._id}>
                        <td>{c.code}</td>
                        <td>{c.heading}</td>
                        <td>{c.description}</td>
                        <td>{new Date(c.expiryDate).toLocaleString()}</td>
                        <td>{c.usageLimit}</td>
                        <td>₹{c.minOrderValue}</td>
                        <td>{c.discountPercent}%</td>
                        <td>₹{c.discountAmount}</td>
                        <td>{c.visible ? 'Yes' : 'No'}</td>
                        <td>{c.assignedTo || '-'}</td> {/* show UID or “-” */}
                        <td>
                          <button
                            onClick={() => startEdit(c)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="delete-btn"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-coupon-row">
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
