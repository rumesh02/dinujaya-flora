import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CustomBoxProvider } from './context/CustomBoxContext.jsx';
import { CreateBoxProvider } from './context/CreateBoxContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Public pages
import HomePage from './pages/HomePage.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Flowers from './pages/Flowers';
import CollectionPage from './pages/CollectionPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import CreateYourBoxPage from './pages/CreateYourBoxPage';
import OccasionPage from './pages/OccasionPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CreateFlowerBox from './pages/CreateFlowerBox';
import CheckoutCustomBox from './pages/CheckoutCustomBox';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import EventsPage from './pages/EventsPage';
import AboutUs from './pages/AboutUs';

// Admin pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Suppliers from './pages/admin/Suppliers.jsx';
import Users from './pages/admin/Users.jsx';
import Products from './pages/admin/Products.jsx';
import Orders from './pages/admin/Orders.jsx';

// User pages
import UserProfile from './pages/user/UserProfile.jsx';
import UserHome from './pages/user/UserHome.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomBoxProvider>
          <CreateBoxProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/flowers" element={<Flowers />} />
                <Route path="/collections/:category" element={<CollectionsPage />} />
                <Route path="/collections/:categoryName" element={<CollectionPage />} />
                <Route path="/collection/:collectionName" element={<CollectionDetailPage />} />
                <Route path="/create-your-box" element={<CreateYourBoxPage />} />
                <Route path="/occasion/:occasionName" element={<OccasionPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/create-flower-box" element={<CreateFlowerBox />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/about" element={<AboutUs />} />
              <Route path="/checkout-custom-box" element={
                <ProtectedRoute>
                  <CheckoutCustomBox />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
              </Route>

              {/* User Routes */}
              <Route path="/user/home" element={
                <ProtectedRoute>
                  <UserHome />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          </CreateBoxProvider>
        </CustomBoxProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
