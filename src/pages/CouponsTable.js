// src/components/CouponsTable.jsx

import React from 'react';

const CouponsTable = ({ coupons, onEdit, onDelete }) => {
  return (
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
              <th>Assigned To</th>
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
                  <td>{c.assignedTo || '-'}</td>
                  <td>
                    <button onClick={() => onEdit(c)} className="edit-btn">
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(c._id)}
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
  );
};

export default CouponsTable;