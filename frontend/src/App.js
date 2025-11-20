import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CustomBoxProvider } from './context/CustomBoxContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Flowers from './pages/Flowers';
import CollectionPage from './pages/CollectionPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import OccasionPage from './pages/OccasionPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CreateFlowerBox from './pages/CreateFlowerBox';
import CheckoutCustomBox from './pages/CheckoutCustomBox';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Suppliers from './pages/admin/Suppliers';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';

// User pages
import UserProfile from './pages/user/UserProfile';
import UserHome from './pages/user/UserHome';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomBoxProvider>
          <Router>
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/flowers" element={<Flowers />} />
              <Route path="/collections/:categoryName" element={<CollectionPage />} />
              <Route path="/collection/:collectionName" element={<CollectionDetailPage />} />
              <Route path="/occasion/:occasionName" element={<OccasionPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* Flower Box Builder */}
              <Route path="/create-flower-box" element={<CreateFlowerBox />} />

              <Route
                path="/checkout-custom-box"
                element={
                  <ProtectedRoute>
                    <CheckoutCustomBox />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
              </Route>

              {/* User Routes */}
              <Route
                path="/user/home"
                element={
                  <ProtectedRoute>
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CustomBoxProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
