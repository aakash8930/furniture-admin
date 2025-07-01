// src/pages/AdminOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders } from '../api/orderApi';
import '../css/Orders.css';
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
        if (!token) throw new Error('Not authenticated as admin');

        const data = await fetchAllOrders(token);
        setOrders(Array.isArray(data) ? data : []);
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

  return (
    <>
      <AdminNavbar />

      <div className="orders-container">
        <h1>All Orders</h1>

        {loading && <p className="center">Loading all orders…</p>}
        {error && <p className="center error">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="center">No orders found.</p>
        )}

        {!loading && !error && orders
          .filter(order => order && order._id)
          .map((order) => (
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
                  <span className={`order-status status-${order.status?.toLowerCase() || 'unknown'}`}>
                    {order.status || 'Unknown'}
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
                {(order.products || []).map(({ product, quantity }, idx) => (
                  <div key={product?._id || idx} className="product-cell">
                    <img
                      src={product?.imageUrl || '/images/placeholder.jpg'}
                      alt={product?.name || 'Unnamed'}
                      className="product-thumb"
                    />
                    <div className="product-info">
                      <p className="product-name">{product?.name || 'Unnamed Product'}</p>
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
