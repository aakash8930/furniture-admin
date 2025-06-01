// src/pages/AdminOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders } from '../api/orderApi';
import '../css/Orders.css'; // Reuse your OrdersPage.css for styling
import AdminNavbar from './Navbar';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Not authenticated as admin');
        }
        const data = await fetchAllOrders(token);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders (admin):', err);
        const msg =
          err.response?.data?.message || err.message || 'Could not load orders';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="center">Loading all orders…</p>;
  }
  if (error) {
    return <p className="center error">{error}</p>;
  }
  if (!orders.length) {
    return <p className="center">No orders found.</p>;
  }

  return (
        <>
          <AdminNavbar />
    <div className="orders-container">
      <h1>All Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-card-header">
            <div>
              <strong>Order ID:</strong> {order.orderId || order._id}
            </div>
            <div>
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleDateString()}{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`order-status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <button
              className="view-order-btn"
              onClick={() => navigate(`/admin/orders/${order._id}`)}
            >
              View Details
            </button>
          </div>

          <div className="order-products-grid">
            {order.products.map(({ product, quantity }) => (
              <div key={product._id} className="product-cell">
                <img
                  src={product.imageUrl || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="product-thumb"
                />
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-qty">x{quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
