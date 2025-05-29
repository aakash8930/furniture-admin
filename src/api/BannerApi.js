// src/api/BannerApi.js
import axios from 'axios';

const ADMIN_BASE = 'http://localhost:8000/api/admin/banners';

function authHeaders(multipart = false) {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    ...(multipart ? {} : { 'Content-Type': 'application/json' })
  };
}

export const fetchBanners = () =>
  axios
    .get(ADMIN_BASE, { headers: authHeaders() })
    .then((res) => res.data);

// Now createBanner expects a FormData instance
export const createBanner = (formData) =>
  axios
    .post(ADMIN_BASE, formData, {
      headers: authHeaders(/* multipart */ true)
      // Axios will set the Content-Type: multipart/form-data; boundary=…
    })
    .then((res) => res.data);

export const deleteBanner = (id) =>
  axios
    .delete(`${ADMIN_BASE}/${id}`, { headers: authHeaders() })
    .then((res) => res.data);
