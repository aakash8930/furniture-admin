// src/api/OrderApi.js

import axios from 'axios';

// Base backend URL (adjust if using an environment variable)
const BASE_URL = 'http://localhost:8000';

/**
 * Fetch all orders (admin only).
 * @param {string} adminToken – JWT for admin authentication
 * @returns {Promise<Array>} – Array of order objects
 */
export async function fetchAllOrders(adminToken) {
  if (!adminToken) {
    throw new Error('Missing admin authentication token');
  }
  const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data; // Expect an array of orders
}

/**
 * Fetch a single order by ID (admin only).
 * @param {string} adminToken – JWT for admin authentication
 * @param {string} orderId – Mongo _id or business orderId
 * @returns {Promise<Object>} – Order object
 */
export async function getOrderById(adminToken, orderId) {
  if (!adminToken) {
    throw new Error('Missing admin authentication token');
  }
  const response = await axios.get(`${BASE_URL}/api/admin/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
}

/**
 * Update an order’s status (admin only).
 * @param {string} adminToken – JWT for admin authentication
 * @param {string} orderId – Mongo _id or business orderId
 * @param {string} newStatus – New status string (e.g. 'Confirmed', 'Shipped', etc.)
 * @returns {Promise<Object>} – Updated order object
 */
export async function updateOrderStatus(adminToken, orderId, newStatus) {
  if (!adminToken) {
    throw new Error('Missing admin authentication token');
  }
  const response = await axios.put(
    `${BASE_URL}/api/admin/orders/${orderId}/status`,
    { status: newStatus },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.data;
}
