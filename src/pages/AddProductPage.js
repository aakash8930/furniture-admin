import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';
import ProductPage from './Product';

const CATEGORY_OPTIONS = [
  "SALE", "BEDROOM", "LIVING ROOM",
  "DINING", "OFFICE", "TABLEWARE", "OUTDOOR",
  "DECOR",
  //  "Kitchen Linens", "Serveware", "Crockery", "Dinner sets",
  // "Table Linen", "Cutlery", "Home Accessories", "Lighting", "Wall Decor",
  // "Fragrances", "Garden", "Bedding", "Curtains", "Cushions", "Floor coverings", "Accessories"
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
      <AdminNavbar Products={ProductPage} />
      <div style={outerContainerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>🪑 Add New Product</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
            <FormInput label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
            <FormInput label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <FormInput label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} />

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Product details..."
                style={textareaStyle}
                rows={4}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Upload Images</label>
              <div style={imageGridStyle}>
                {[1, 2, 3, 4, 5].map(i => (
                  <input
                    key={i}
                    name={`image${i}`}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    style={fileInputStyle}
                  />
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
              <button
                type="submit"
                style={submitBtnStyle}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
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
  <div>
    <label style={labelStyle}>{label}</label>
    <input {...props} required style={inputStyle} />
  </div>
);

// Styles

const outerContainerStyle = {
  minHeight: '100vh',
  padding: '2rem',
  background: 'linear-gradient(to bottom right, #e0f2fe, #f8fafc)',
};

const cardStyle = {
  padding: '2rem',
  maxWidth: '720px',
  margin: 'auto',
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(203, 213, 225, 0.4)',
};

const headingStyle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  marginBottom: '1.5rem',
  color: '#1f2937',
  textAlign: 'center',
};

const formStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
};

const labelStyle = {
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#1f2937',
  marginBottom: '6px',
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '0.95rem',
  backgroundColor: '#f9fafb',
  transition: 'border 0.2s ease',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

const fileInputStyle = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  background: '#f1f5f9',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const imageGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '0.75rem',
};

const submitBtnStyle = {
  padding: '14px 28px',
  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
  boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
  textAlign: 'center',
};

export default AddProductPage;
