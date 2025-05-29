// src/api/ProductApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const ADMIN_PRODUCTS_URL = `${BASE_URL}/api/products`;

// Fetch all products (admin)
export const fetchAllProducts = async () => {
  const { data } = await axios.get(ADMIN_PRODUCTS_URL);
  return data;
};

// Fetch a single product by ID (admin)
export const fetchProductById = async (productId) => {
  const { data } = await axios.get(`${ADMIN_PRODUCTS_URL}/${productId}`);
  return data;
};

// Fetch products by category (admin)
export const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(`${ADMIN_PRODUCTS_URL}/category/${category}`);
  return data;
};

// Create a new product (admin)
export const createProduct = async (productData) => {
  const formData = new FormData();

  // 1) append only text fields
  ['name', 'category', 'price', 'stock', 'discount', 'details']
    .forEach(key => {
      const val = productData[key];
      if (val != null) formData.append(key, val);
    });

  // 2) append only the file fields
  ['image1', 'image2', 'image3', 'image4', 'image5']
    .forEach(key => {
      if (productData[key]) {
        formData.append(key, productData[key]);
      }
    });

  // let Axios/browser set the Content-Type boundary for you
  const { data } = await axios.post(ADMIN_PRODUCTS_URL, formData);
  return data;
};

// Update an existing product (admin)
export const updateProduct = async (productId, productData) => {
  const formData = new FormData();

  // 1) append only text fields
  ['name', 'category', 'price', 'stock', 'discount', 'details']
    .forEach(key => {
      const val = productData[key];
      if (val != null) formData.append(key, val);
    });

  // 2) append only the file fields
  ['image1', 'image2', 'image3', 'image4', 'image5']
    .forEach(key => {
      if (productData[key]) {
        formData.append(key, productData[key]);
      }
    });

  const { data } = await axios.put(`${ADMIN_PRODUCTS_URL}/${productId}`, formData);
  return data;
};

// Delete a product (admin)
export const deleteProduct = async (productId) => {
  const { data } = await axios.delete(`${ADMIN_PRODUCTS_URL}/${productId}`);
  return data;
};
