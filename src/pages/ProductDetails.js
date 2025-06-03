// src/components/AdminProductDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { fetchProductById } from "../api/ProductApi";
import AdminNavbar from "./Navbar";
import ReviewList from "./ReviewList";

import "../css/ProductDetails.css";

export default function AdminProductDetails() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const REVIEW_BASE_URL = "http://localhost:8000/api/reviews";

  useEffect(() => {
    if (!productId) {
      setLoadingProduct(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        console.log("DEBUG: fetched product data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      setLoadingReviews(false);
      return;
    }
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${REVIEW_BASE_URL}/${productId}`);
        console.log("DEBUG: fetched reviews array:", response.data);
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [productId]);

  if (loadingProduct) return <p className="loading-text">Loading product…</p>;

  if (!product)
    return (
      <div>
        <AdminNavbar />
        <p className="error-text">Product not found.</p>
      </div>
    );

  return (
    <>
      <AdminNavbar />
      <div className="admin-product-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Products
        </button>

        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-category">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="product-price">
            <strong>Price:</strong> ₹{product.price.toFixed(2)}
          </p>
          <p className="product-stock">
            <strong>Stock:</strong> {product.stock}
          </p>
          {product.details && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.details}</p>
            </div>
          )}
        </div>

        <div className="product-images">
          <h3>Images</h3>
          <div className="images-grid">
            {["image1", "image2", "image3", "image4", "image5"].map((key) => {
              if (product.images?.[key]?.data) {
                return (
                  <img
                    key={key}
                    src={`data:${product.images[key].contentType};base64,${product.images[key].data}`}
                    alt={`${product.name}-${key}`}
                    className="detail-image"
                  />
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="reviews-section">
          <h3 className="reviews-heading">
            Reviews ({product.rating?.count || 0})
          </h3>
          {product.rating?.count > 0 && (
            <div className="overall-rating">
              <span className="avg-value">
                Average: {product.rating.average.toFixed(1)} / 5
              </span>
            </div>
          )}
          {loadingReviews ? (
            <p className="loading-text">Loading reviews…</p>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>
    </>
  );
}
