// src/pages/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';
import '../css/EditProductPage.css'; // Import the new CSS file

const CATEGORY_OPTIONS = [
  "SALE", "BEDROOM", "LIVING ROOM",
  "DINING", "OFFICE", "TABLEWARE", "OUTDOOR",
  "DECOR",
];

const EditProductPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const prod = await fetchProductById(id);
        setForm({
          name: prod.name,
          category: prod.category,
          price: prod.price,
          stock: prod.stock,
          discount: prod.discount,
          details: prod.details,
          image1: null, image2: null, image3: null, image4: null, image5: null,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!form) return <p>Loading…</p>;

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
      await updateProduct(id, form);
      navigate('/admin/products');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update product');
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="edit-product-page">
        <form onSubmit={handleSubmit} className="edit-product-form">
          <h2>Edit Product</h2>

          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input name="price" value={form.price} type="number" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input name="stock" value={form.stock} type="number" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input name="discount" value={form.discount} type="number" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="details" value={form.details} onChange={handleChange} />
          </div>

          <div className="form-group image-upload-group">
            <label className="group-title">Images (Optional: only upload to replace existing ones)</label>
            <div className="image-input-row">
              <label htmlFor="image1">Image 1:</label>
              <input id="image1" name="image1" type="file" accept="image/*" onChange={handleChange} />
            </div>
            <div className="image-input-row">
              <label htmlFor="image2">Image 2:</label>
              <input id="image2" name="image2" type="file" accept="image/*" onChange={handleChange} />
            </div>
            <div className="image-input-row">
              <label htmlFor="image3">Image 3:</label>
              <input id="image3" name="image3" type="file" accept="image/*" onChange={handleChange} />
            </div>
            <div className="image-input-row">
              <label htmlFor="image4">Image 4:</label>
              <input id="image4" name="image4" type="file" accept="image/*" onChange={handleChange} />
            </div>
            <div className="image-input-row">
              <label htmlFor="image5">Image 5:</label>
              <input id="image5" name="image5" type="file" accept="image/*" onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="submit-btn">Save Changes</button>
        </form>
      </div>
    </>
  );
};

export default EditProductPage;
