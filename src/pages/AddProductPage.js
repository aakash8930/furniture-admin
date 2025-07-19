// src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';
<<<<<<< HEAD

// This map is needed for the dynamic sub-category dropdown
const SUBCATEGORY_MAP = {
  'BEDROOM': ['Beds', 'Wardrobes', 'Nightstands', 'Dressers'],
  'LIVING ROOM': ['Sofas', 'Coffee Tables', 'TV Units', 'Accent Chairs'],
  'DINING': ['Dining Tables', 'Dining Chairs', 'Sideboards', 'Bar Cabinets'],
  'OFFICE': ['Work Desks', 'Office Chairs', 'Bookshelves'],
  'TABLEWARE': ['Dinnerware', 'Serveware', 'Cutlery', 'Glassware'],
  'OUTDOOR': ['Outdoor Seating', 'Patio Tables', 'Garden Decor'],
  'DECOR': ['Vases', 'Lamps', 'Rugs', 'Wall Art'],
  'SALE': [],
};

const COLOR_OPTIONS = ['Brown', 'Beige', 'Black', 'White'];
=======
import '../css/AddProductPage.css'; // Import the new CSS file
>>>>>>> ad4662a73243429efa03b2904789156a90c37d8b

const CATEGORY_OPTIONS = [
  "SALE", "BEDROOM", "LIVING ROOM",
  "DINING", "OFFICE", "TABLEWARE", "OUTDOOR",
  "DECOR",
];

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: '', category: CATEGORY_OPTIONS[0], subCategory: '', color: '',
    price: '', stock: '', discount: '', details: '',
    image1: null, image2: null, image3: null, image4: null, image5: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'category') {
        setForm(prev => ({
            ...prev,
            category: value,
            subCategory: ''
        }));
    } else {
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    }
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
  
  const currentSubCategories = SUBCATEGORY_MAP[form.category] || [];

  return (
    <>
      <AdminNavbar />
      <div style={outerContainerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>🪑 Add New Product</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
            <FormInput label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
            <FormInput label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <FormInput label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} />

            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Sub-Category</label>
              <select name="subCategory" value={form.subCategory} onChange={handleChange} style={inputStyle} disabled={currentSubCategories.length === 0}>
                <option value="">-- Select Sub-Category --</option>
                {currentSubCategories.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Color / Finish</label>
              <select name="color" value={form.color} onChange={handleChange} style={inputStyle}>
                <option value="">-- Select Color --</option>
                {COLOR_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="details" value={form.details} onChange={handleChange} style={textareaStyle} rows={4} />
            </div>

            {/* **FIXED**: This section now displays the filename */}
            <div className="form-group full-width">
              <label>Upload Images</label>
              <div className="image-grid">
                {[1, 2, 3, 4, 5].map(i => (
                  <input key={i} name={`image${i}`} type="file" accept="image/*" onChange={handleChange} style={fileInputStyle} />
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
              <button type="submit" style={submitBtnStyle}>Create Product</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


// ===================================================================
// THIS IS THE SECTION THAT WAS INCORRECT IN YOUR FILE
// Helper component and style objects must be fully defined.
// ===================================================================

const FormInput = ({ label, ...props }) => (
  <div className="form-group">
    <label>{label}</label>
    <input {...props} required />
  </div>
);

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
  boxSizing: 'border-box'
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
  boxSizing: 'border-box'
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
