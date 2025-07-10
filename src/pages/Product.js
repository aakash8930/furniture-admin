// src/pages/ProductPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchAllProducts,
  deleteProduct as apiDeleteProduct,
} from '../api/ProductApi';
import AdminNavbar from '../pages/Navbar.js';
import '../css/Product.css'; // Ensure this path is correct

// A simple trash icon component
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // --- Load all products on initial render ---
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    loadProducts();
  }, []);

  // --- Filter products based on search query ---
  const filtered = products.filter(
    p =>
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  );

  // --- API Handlers ---
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiDeleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = id => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <>
      <AdminNavbar />
      <div className="product-page">
        <h2 className="product-heading">Manage Products</h2>

        <div className="product-controls">
          <button
            className="btn btn-add-product"
            onClick={() => navigate('/admin/products/add')}
          >
            + Add Product
          </button>
          <input
            type="text"
            className="product-search"
            placeholder="Search by name or category..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="product-grid">
          {filtered.map(p => (
            <div key={p._id} className="product-card">
              <div className="product-image-wrapper">
                {p.images?.image1?.data ? (
                  <img
                    src={`data:${p.images.image1.contentType};base64,${p.images.image1.data}`}
                    alt={p.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}
              </div>

              <div className="product-content">
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-category">{p.category}</p>
                  <p className="product-price">₹{p.price.toFixed(2)}</p>
                  <div className="product-stock">
                    <span className={`stock-dot ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}`}></span>
                    {p.stock > 0 ? `In Stock: ${p.stock} units` : 'Out of Stock'}
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => handleEdit(p._id)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-delete"
                  >
                    <TrashIcon />
                    Delete
                  </button>
                  <Link
                    to={`/admin/products/${p._id}`}
                    className="btn btn-details"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No products found.</p>}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
