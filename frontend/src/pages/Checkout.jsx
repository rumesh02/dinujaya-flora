import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, MapPin, User, Mail, Phone, Home, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Sri Lanka'
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
    }

    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [cart, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderId = () => {
    return 'DF' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();
      const amount = getCartTotal();
      const currency = 'LKR';

      console.log('Initiating payment:', { orderId, amount, currency });

      // Get payment hash from backend
      const hashResponse = await axios.post('http://localhost:5000/api/payment/generate-hash', {
        orderId,
        amount,
        currency
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { hash, merchantId } = hashResponse.data;
      
      console.log('Payment hash received:', { hash, merchantId });

      // Prepare PayHere payment object
      const payment = {
        sandbox: true, // Set to false for production
        merchant_id: merchantId,
        return_url: undefined,     // Important for popup mode
        cancel_url: undefined,     // Important for popup mode
        notify_url: 'http://localhost:5000/api/payment/notify',
        order_id: orderId,
        items: `${cart.length} item(s) from Dinujaya Flora`,
        amount: amount.toFixed(2),
        currency: currency,
        hash: hash,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        delivery_address: formData.deliveryAddress || formData.address,
        delivery_city: formData.deliveryCity || formData.city,
        delivery_country: formData.deliveryCountry || formData.country
      };

      // Add individual items (PayHere supports up to 10 items)
      cart.slice(0, 10).forEach((item, index) => {
        const itemNum = index + 1;
        payment[`item_name_${itemNum}`] = item.name;
        payment[`item_number_${itemNum}`] = item._id;
        payment[`amount_${itemNum}`] = item.price.toFixed(2);
        payment[`quantity_${itemNum}`] = item.quantity;
      });

      console.log('PayHere payment object:', payment);

      // Set up PayHere event handlers
      window.payhere.onCompleted = function(orderId) {
        console.log('Payment completed. OrderID:', orderId);
        // Clear cart and redirect to success page
        clearCart();
        navigate('/payment-success', { 
          state: { 
            orderId, 
            amount: getCartTotal(),
            status: 'completed'
          } 
        });
      };

      window.payhere.onDismissed = function() {
        console.log('Payment dismissed');
        setLoading(false);
        alert('Payment was cancelled. Please try again.');
      };

      window.payhere.onError = function(error) {
        console.log('Error:', error);
        setLoading(false);
        alert('An error occurred during payment. Please try again.');
      };

      // Start payment
      window.payhere.startPayment(payment);
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
              <p className="text-gray-500 mb-6">You need to be logged in to checkout</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-gray-600 hover:text-rose-600 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-6 h-6 text-rose-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="0771234567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Home className="w-6 h-6 text-rose-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Billing Address</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Street address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-rose-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                    <span className="ml-2 text-sm text-gray-500">(Optional - defaults to billing)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Leave empty to use billing address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery City
                      </label>
                      <input
                        type="text"
                        name="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Country
                      </label>
                      <input
                        type="text"
                        name="deliveryCountry"
                        value={formData.deliveryCountry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3 pb-4 border-b">
                      <img
                        src={item.image ? `http://localhost:5000/uploads/products/${item.image}` : '/images/default-flower.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-rose-600">Rs {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-rose-600">Rs {getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-rose-600 text-white py-4 rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with PayHere
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">🔒 Secure Payment</span>
                    <br />
                    Powered by PayHere - Your payment information is encrypted and secure
                  </p>
                </div>

                {/* Sandbox Info */}
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <span className="font-semibold">⚠️ SANDBOX MODE</span>
                    <br />
                    This is a test payment. Use PayHere test cards for testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
