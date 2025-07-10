// src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';
import '../css/AddProductPage.css'; // Import the new CSS file

const CATEGORY_OPTIONS = [
  "SALE", "BEDROOM", "LIVING ROOM",
  "DINING", "OFFICE", "TABLEWARE", "OUTDOOR",
  "DECOR",
];

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: '', category: CATEGORY_OPTIONS[0], price: '', stock: '', discount: '',
    details: '', image1: null, image2: null, image3: null, image4: null, image5: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(form);
      navigate('/admin/products');
    } catch (err) {
      console.error("Add product failed ▶", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="add-product-page">
        <div className="add-product-card">
          <div className="card-header">
            <h2 className="heading">🪑 Add New Product</h2>
          </div>
          <form onSubmit={handleSubmit} className="add-product-form">
            <div className="form-row">
              <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
              <FormInput label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-row">
              <FormInput label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
              <FormInput label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Product details..."
                rows={4}
              />
            </div>

            {/* **FIXED**: This section now displays the filename */}
            <div className="form-group full-width">
              <label>Upload Images</label>
              <div className="image-grid">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="file-input-container">
                    <label htmlFor={`image-input-${i}`} className="file-input-label">
                      Choose File
                    </label>
                    <input
                      id={`image-input-${i}`}
                      name={`image${i}`}
                      type="file"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={handleChange}
                    />
                    <span className="file-name-display">
                      {form[`image${i}`] ? form[`image${i}`].name : 'No file chosen'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full-width text-center">
              <button type="submit" className="submit-btn">
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="form-group">
    <label>{label}</label>
    <input {...props} required />
  </div>
);

export default AddProductPage;
