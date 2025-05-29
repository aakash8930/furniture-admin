// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllProducts,
  deleteProduct as apiDeleteProduct,
} from '../api/ProductApi';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
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
          <div key={p._id} style={cardStyle}>
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
  );
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const searchStyle = {
  flexGrow: 1,
  marginLeft: '1rem',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '1rem'
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const imageContainerStyle = {
  width: '100%',
  paddingTop: '75%', // 4:3 aspect ratio
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '4px',
  background: '#f9f9f9'
};

const imageStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const placeholderStyle = {
  ...imageContainerStyle,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#999'
};

const editBtnStyle = {
  padding: '0.25rem 0.5rem',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteBtnStyle = {
  ...editBtnStyle,
  background: '#dc3545',
  marginLeft: '0.5rem'
};

export default ProductPage;
