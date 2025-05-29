import axios from 'axios';

const BASE = 'http//localhost:8000/admin';

export async function loginAdmin(email, password) {
  const { data } = await axios.post(`${BASE}/login`, { email, password });
  return data; // { token, adminInfo… }
}

// e.g. fetch dashboard stats
export async function fetchStats() {
  const token = localStorage.getItem('adminToken');
  const { data } = await axios.get(`${BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
