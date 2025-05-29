import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

/**
 * Create a new coupon
 * @param {Object} data - Coupon details
 */
export const createCoupon = async (data) => {
  const res = await axios.post(`${BASE_URL}/api/admin/coupons`, data);
  return res.data;
};

/**
 * Fetch all coupons
 */
export const fetchAllCoupons = async () => {
  const res = await axios.get(`${BASE_URL}/api/admin/coupons`);
  return res.data;
};

/**
 * Delete a coupon by ID
 * @param {string} id - Coupon ID
 */
export const deleteCoupon = async (id) => {
  const res = await axios.delete(`${BASE_URL}/api/admin/coupons/${id}`);
  return res.data;
};

/**
 * Update a coupon by ID
 * @param {string} id - Coupon ID
 * @param {Object} data - Updated coupon data
 */
export const updateCoupon = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/api/admin/coupons/${id}`, data);
  return res.data;
};
