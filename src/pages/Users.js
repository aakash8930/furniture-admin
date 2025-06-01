// src/pages/Users.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../api/userApi';
import AdminNavbar from './Navbar'; // or './Navbar' if that’s your file
import '../css/Users.css';               // create or adjust this CSS file as needed

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        if (!adminToken) throw new Error('Not authenticated as admin');
        const data = await fetchAllUsers(adminToken);
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError(err.message || 'Could not load users');
      } finally {
        setLoading(false);
      }
    })();
  }, [adminToken]);

  if (loading) {
    return <p className="center">Loading users…</p>;
  }
  if (error) {
    return <p className="center error">{error}</p>;
  }
  if (!users.length) {
    return <p className="center">No users found.</p>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="users-container">
        <h1>All Users</h1>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Firebase UID</th>
              <th>Phone</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.firebaseUid}</td>
                <td>{u.phone}</td>
                <td>{u.name || '—'}</td>
                <td>{u.email || '—'}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
