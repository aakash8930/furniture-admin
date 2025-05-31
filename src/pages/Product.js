import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllProducts,
  deleteProduct as apiDeleteProduct,
} from '../api/ProductApi';
import AdminNavbar from './Navbar';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null); // ✅ for hover tracking
  const navigate = useNavigate();

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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiDeleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <>
      <AdminNavbar Products={ProductPage} />
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/admin/products/add')}
            style={buttonStyle}
          >
            + Add Product
          </button>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={searchStyle}
          />
        </div>

        <div style={gridStyle}>
          {filtered.map(p => (
            <div
              key={p._id}
              style={{
                ...cardStyle,
                transform: hoveredCard === p._id ? 'scale(1.03)' : 'scale(1)',
                boxShadow:
                  hoveredCard === p._id
                    ? '0 16px 40px rgba(0, 0, 0, 0.08)'
                    : '0 8px 30px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={() => setHoveredCard(p._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={imageContainerStyle}>
                {p.images?.image1 ? (
                  <img
                    src={`data:${p.images.image1.contentType};base64,${p.images.image1.data}`}
                    alt={p.name}
                    style={imageStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>No Image</div>
                )}
              </div>
              <h3 style={{ margin: '0.5rem 0' }}>{p.name}</h3>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>{p.category}</p>
              <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>₹{p.price.toFixed(2)}</p>
              <p style={{ margin: '0.25rem 0' }}>Stock: {p.stock}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleEdit(p._id)} style={editBtnStyle}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={deleteBtnStyle}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No products found.</p>}
        </div>
      </div>
    </>
  );
};

// Styles (unchanged from your latest version)
const buttonStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: '0.3s ease',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)'
};

const searchStyle = {
  flexGrow: 1,
  marginLeft: '1rem',
  padding: '10px 16px',
  borderRadius: '12px',
  border: '1px solid #d1d5db',
  fontSize: '0.95rem',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.5rem',
  paddingTop: '1rem'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid rgba(203, 213, 225, 0.4)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

const imageContainerStyle = {
  width: '100%',
  paddingTop: '75%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  background: '#f1f5f9',
  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
};

const imageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const placeholderStyle = {
  ...imageContainerStyle,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#9ca3af',
  fontStyle: 'italic',
};

const editBtnStyle = {
  padding: '6px 14px',
  background: '#10b981',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: '600',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
};

const deleteBtnStyle = {
  ...editBtnStyle,
  background: '#ef4444',
  marginLeft: '0.5rem',
  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)',
};

export default ProductPage;
