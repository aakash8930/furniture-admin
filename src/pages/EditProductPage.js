// src/pages/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../api/ProductApi';
import AdminNavbar from './Navbar';

// --- Constants for Dropdowns ---
const CATEGORY_OPTIONS = [
  "SALE", "BEDROOM", "LIVING ROOM",
  "DINING", "OFFICE", "TABLEWARE", "OUTDOOR",
  "DECOR",
];

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

// --- Main Component ---
const EditProductPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  // Fetch product data on component mount
  useEffect(() => {
    (async () => {
      try {
        const prod = await fetchProductById(id);
        // Set the form state with existing product data
        setForm({
          name: prod.name,
          category: prod.category,
          subCategory: prod.subCategory || '', // Pre-fill subCategory
          color: prod.color || '',           // Pre-fill color
          price: prod.price,
          stock: prod.stock,
          discount: prod.discount,
          details: prod.details,
          // Image fields are for new uploads; existing images are not re-fetched here
          image1: null, image2: null, image3: null, image4: null, image5: null,
        });
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        alert("Could not load product data.");
      }
    })();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Reset subCategory if the main category changes
    if (name === 'category') {
        setForm(prev => ({
            ...prev,
            category: value,
            subCategory: '' // Reset
        }));
    } else {
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    }
  };

  // Handle form submission
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

  if (!form) return <p>Loading…</p>;

  const currentSubCategories = SUBCATEGORY_MAP[form.category] || [];

  return (
    <>
      <AdminNavbar />
      <div style={outerContainerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>✏️ Edit Product</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            {/* Re-using the styled FormInput helper */}
            <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
            <FormInput label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
            <FormInput label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <FormInput label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} />
            
            {/* Category Dropdown */}
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Sub-Category Dropdown */}
            <div>
              <label style={labelStyle}>Sub-Category</label>
              <select name="subCategory" value={form.subCategory} onChange={handleChange} style={inputStyle} disabled={currentSubCategories.length === 0}>
                <option value="">-- Select Sub-Category --</option>
                {currentSubCategories.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Color Dropdown */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Color / Finish</label>
              <select name="color" value={form.color} onChange={handleChange} style={inputStyle}>
                <option value="">-- Select Color --</option>
                {COLOR_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Description and Image Uploads */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="details" value={form.details} onChange={handleChange} style={textareaStyle} rows={4} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Upload New Images (optional, will overwrite existing)</label>
              <div style={imageGridStyle}>
                {[1, 2, 3, 4, 5].map(i => (
                  <input key={i} name={`image${i}`} type="file" accept="image/*" onChange={handleChange} style={fileInputStyle} />
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
              <button type="submit" style={submitBtnStyle}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// --- Helper Components & Styles (for a consistent UI) ---

const FormInput = ({ label, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input {...props} required style={inputStyle} />
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

export default EditProductPage;
