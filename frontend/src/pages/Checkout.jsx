import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, CreditCard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryDate: '',
    deliveryTime: 'morning',
    paymentMethod: 'cash',
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      clearCart();
      navigate('/payment-success');

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
            <button
              onClick={() => navigate('/flowers')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              Browse Flowers
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Route path="/create-flower-box" element={<CreateFlowerBox />} />
              <Route
                path="/checkout-custom-box"
                element={
                  <ProtectedRoute>
                    <CheckoutCustomBox />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes (nested under /admin) */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />
              {/* Note: AdminLayout should render nested routes via <Outlet /> */}

              {/* We'll still define the nested admin routes using a PathPrefix in AdminLayout or via separate Router in AdminLayout.
                  Alternatively you can define them explicitly here as well: */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/suppliers"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Suppliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Orders />
                  </ProtectedRoute>
                }
              />

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

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CustomBoxProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
