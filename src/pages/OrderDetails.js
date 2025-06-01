// src/pages/AdminOrderDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getOrderById as fetchOrderByAdmin,
  updateOrderStatus as updateOrderStatusAdmin,
} from '../api/orderApi';
import axios from 'axios';
import '../css/OrderDetails.css'; // Reuse existing CSS
import AdminNavbar from './Navbar';

export default function AdminOrderDetailsPage() {
  const { id } = useParams(); // the order _id or business orderId
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Not authenticated as admin');

        const data = await fetchOrderByAdmin(token, id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order (admin):', err);
        const msg = err.response?.data?.message || err.message || 'Could not load order';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Not authenticated as admin');

      const updated = await updateOrderStatusAdmin(token, id, newStatus);
      setOrder(updated);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Unable to change status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Not authenticated as admin');
        return;
      }
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/admin/orders/${id}/invoice`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${order.orderId || order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice');
      console.error(err);
    }
  };

  if (loading) return <p className="center">Loading order details…</p>;
  if (error) return <p className="center error">{error}</p>;
  if (!order) return null;

  // Must match backend enum: ['Pending','Confirmed','Shipped','Delivered','Cancelled']
  const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  const canDownload = order.status === 'Delivered';

  return (
        <>
          <AdminNavbar />
    <div className="order-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Orders
      </button>

      <div className="order-info">
        <h2>Order #{order.orderId || order._id}</h2>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={actionLoading}
            className="status-select"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {actionLoading && <span style={{ marginLeft: '0.5rem' }}>Updating…</span>}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
      </div>

      <div className="payment-breakdown">
        <h3>Payment Breakdown</h3>
        <div>
          <span>Items Total:</span>
          <span>₹{order.paymentBreakdown.itemsTotal.toLocaleString()}</span>
        </div>
        <div>
          <span>Tax:</span>
          <span>₹{order.paymentBreakdown.tax.toLocaleString()}</span>
        </div>
        <div>
          <span>Shipping:</span>
          <span>₹{order.paymentBreakdown.shipping.toLocaleString()}</span>
        </div>
        {order.paymentBreakdown.discount > 0 && (
          <div>
            <span>Discount:</span>
            <span>−₹{order.paymentBreakdown.discount.toLocaleString()}</span>
          </div>
        )}
        <hr />
        <div className="grand-total">
          <strong>Total:</strong>
          <strong>₹{order.paymentBreakdown.total.toLocaleString()}</strong>
        </div>
      </div>

      <div className="order-products">
        <h3>Products</h3>
        <div className="products-grid">
          {order.products.map(({ product, quantity }) => (
            <div key={product._id} className="product-cell">
              <img src={product.imageUrl || '/images/placeholder.jpg'} alt={product.name} />
              <p>{product.name}</p>
              <p>Qty: {quantity}</p>
              <p>₹{(product.price * quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-address">
        <h3>Delivery Address</h3>
        <p>{order.userAddress.fullName}</p>
        <p>
          {order.userAddress.flat}, {order.userAddress.area}
        </p>
        <p>
          {order.userAddress.city} – {order.userAddress.pincode}
        </p>
        <p>{order.userAddress.state}</p>
        <p>Phone: {order.userAddress.phone}</p>
      </div>

      <div className="order-actions">
        <button
          className={`invoice-btn ${!canDownload ? 'disabled' : ''}`}
          onClick={handleDownloadInvoice}
          disabled={!canDownload}
        >
          Download Invoice
        </button>
      </div>

      <div className="order-tracking">
        <h3>Track Shipment</h3>
        {/* Admin-side shipment tracking integration goes here */}
        Shipment tracking details…
      </div>
    </div>
    </>
  );
}
