import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BannerPage from './pages/Banner';     // <= import your banner page
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './pages/Product';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CouponPage from './pages/Coupon';
import AdminOrders from './pages/Orders';
import AdminOrderDetails from './pages/OrderDetails';
import UsersPage from './pages/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public/customer routes */}
        <Route path="/login" element={<Login />} />
        
        {/* admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/banners" 
          element={
            <ProtectedRoute>
              <BannerPage />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/admin/coupon" 
          element={
            <ProtectedRoute>
              <CouponPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
        <Route path="/admin/products/add"   element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
        <Route path="/admin/products/edit/:id" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />



        {/* catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}