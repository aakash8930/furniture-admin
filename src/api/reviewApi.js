// src/api/reviewApi.js

import axios from 'axios';

// 1. Set the Base URL using the environment variable
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const ADMIN_REVIEWS_URL = `${BASE_URL}/api/admin/reviews`;

/**
 * Helper function to get admin auth headers.
 * @returns {Object} Headers object with Authorization token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('Admin authentication token not found.');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

/**
 * Fetch all reviews (admin only).
 * @returns {Promise<Array>} Array of review objects
 */
export const fetchAllReviews = async () => {
  try {
    const res = await axios.get(ADMIN_REVIEWS_URL, getAuthHeaders());
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.error || err.message || 'Failed to fetch reviews';
    throw new Error(msg);
  }
};

/**
 * Delete a specific review by its ID (admin only).
 * @param {string} reviewId - The _id of the review to delete.
 * @returns {Promise<Object>} Success message
 */
export const deleteReview = async (reviewId) => {
  try {
    const res = await axios.delete(
      `${ADMIN_REVIEWS_URL}/${reviewId}`,
      getAuthHeaders()
    );
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.error || err.message || 'Failed to delete review';
    throw new Error(msg);
  }
};