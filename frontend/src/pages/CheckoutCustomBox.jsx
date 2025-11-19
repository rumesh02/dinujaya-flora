import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, CreditCard, Package } from 'lucide-react';
import { useCustomBox } from '../context/CustomBoxContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CheckoutCustomBox = () => {
  const navigate = useNavigate();
  const { boxItems, getBoxTotal, clearBox } = useCustomBox();
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
    
    if (boxItems.length === 0) {
      setError('Your flower box is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        boxItems: boxItems.map(item => ({
          flowerId: item._id,
          quantity: item.quantity
        })),
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
        'http://localhost:5000/api/orders/custom-box',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Clear the custom box
      clearBox();

      // Navigate to order confirmation or orders page
      alert('Custom flower box order placed successfully!');
      navigate('/');

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (boxItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Box is Empty</h2>
            <p className="text-gray-600 mb-6">Add some flowers to your custom box before checkout</p>
            <button
              onClick={() => navigate('/create-flower-box')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              Create Your Flower Box
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Checkout - Custom Flower Box
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                    {error}
                  </div>
                )}

                {/* Recipient Information */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-pink-500" />
                    Recipient Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-pink-500" />
                    Delivery Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip/Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Schedule */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-pink-500" />
                    Delivery Schedule
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time *
                      </label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                        <option value="evening">Evening (3 PM - 6 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-pink-500" />
                    Payment Method
                  </h2>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                {/* Special Instructions */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Any special requests or delivery instructions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {boxItems.map((item) => (
                    <div key={item._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || 'https://via.placeholder.com/60x60?text=Flower'}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-pink-600 font-bold text-sm">LKR {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-semibold">{boxItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-pink-600">LKR {getBoxTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCustomBox;
