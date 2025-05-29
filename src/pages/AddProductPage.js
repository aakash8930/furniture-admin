// src/pages/AddProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';
import ProductPage from './Product';

const CATEGORY_OPTIONS = [
  "Living room furniture",
  "Bedroom furniture",
  "Dining room furniture",
  "Accent Chairs",
  "Customized recliners",
  "Cookware",
  "Storage & Containers",
  "Kitchenware",
  "Kitchen Linens",
  "Serveware",
  "Crockery",
  "Dinner sets",
  "Table Linen",
  "Cutlery",
  "Home Accessories",
  "Lighting",
  "Wall Decor",
  "Fragrances",
  "Garden",
  "Bedding",
  "Curtains",
  "Cushions",
  "Floor coverings",
  "Accessories"
];

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: '',
    category: CATEGORY_OPTIONS[0],
    price: '',
    stock: '',
    discount: '',
    details: '',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
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
    <AdminNavbar Products={ProductPage}/>
    <div style={{ padding: '1rem' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: 400 }}>
      <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <label>Price</label>
        <input
          name="price"
          value={form.price}
          placeholder="Price"
          type="number"
          onChange={handleChange}
          required
        />
        <label>Stock</label>
        <input
          name="stock"
          value={form.stock}
          placeholder="Stock"
          type="number"
          onChange={handleChange}
          required
        />
        <label>Discount</label>
        <input
          name="discount"
          value={form.discount}
          placeholder="Discount"
          type="number"
          onChange={handleChange}
        />
        <label>Description</label>
        <textarea
          name="details"
          value={form.details}
          placeholder="Details"
          onChange={handleChange}
          rows={3}
        />
        <label>Images</label>
        <label>Image 1: <input name="image1" type="file" accept="image/*" onChange={handleChange} /></label>
        <label>Image 2: <input name="image2" type="file" accept="image/*" onChange={handleChange} /></label>
        <label>Image 3: <input name="image3" type="file" accept="image/*" onChange={handleChange} /></label>
        <label>Image 4: <input name="image4" type="file" accept="image/*" onChange={handleChange} /></label>
        <label>Image 5: <input name="image5" type="file" accept="image/*" onChange={handleChange} /></label>

        <button type="submit" style={{ padding: '0.5rem' }}>Create Product</button>
      </form>
    </div>
    </>
  );
};

export default AddProductPage;
