import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
              <p className="text-gray-500 mb-6">You need to be logged in to view your cart</p>
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any flowers yet</p>
              <button
                onClick={() => navigate('/flowers')}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
              >
                Shop Flowers
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
              onClick={() => navigate('/flowers')}
              className="flex items-center text-gray-600 hover:text-rose-600 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cart.map((item) => (
                  <div key={item._id} className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={(() => {
                            // Handle Base64 images
                            if (item.imageBase64) {
                              if (item.imageBase64.startsWith('data:image')) {
                                return item.imageBase64;
                              }
                              return `data:image/jpeg;base64,${item.imageBase64}`;
                            }
                            if (item.image) {
                              // Complete Base64 data URI
                              if (item.image.startsWith('data:image')) {
                                return item.image;
                              }
                              // External URL
                              if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
                                return item.image;
                              }
                              // Base64 without prefix
                              if (item.image.length > 200) {
                                return `data:image/jpeg;base64,${item.image}`;
                              }
                              // Local file path
                              return `http://localhost:5000/uploads/products/${item.image}`;
                            }
                            return '/images/default-flower.jpg';
                          })()}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/images/default-flower.jpg';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 hover:text-rose-600 cursor-pointer"
                                onClick={() => navigate(`/product/${item._id}`)}>
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x-2 border-gray-300 min-w-[60px] text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Rs {item.price?.toFixed(2)} each</p>
                            <p className="text-xl font-bold text-rose-600">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= item.stock && (
                          <p className="text-xs text-yellow-600 mt-2">
                            Maximum available stock: {item.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-rose-600">Rs {getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-rose-600 text-white py-4 rounded-lg font-semibold hover:bg-rose-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/flowers')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Cart Info */}
                <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">💐 Free delivery</span> on orders over Rs 5,000
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

export default Cart;
