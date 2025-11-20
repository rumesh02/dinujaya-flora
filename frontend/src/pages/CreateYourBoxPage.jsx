import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, Loader, AlertCircle, ShoppingCart, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCreateBox } from '../context/CreateBoxContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CreateYourBoxPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { boxItems, addFlower, removeFlower, updateQuantity, clearBox, getTotal, getItemCount } = useCreateBox();
  
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchIndividualFlowers();
  }, []);

  const fetchIndividualFlowers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch only individual flowers (type=individual)
      const response = await axios.get('http://localhost:5000/api/products?type=individual&isAvailable=true');
      
      if (response.data.success) {
        setFlowers(response.data.data || []);
      } else {
        setError('Failed to load flowers');
      }
    } catch (err) {
      console.error('Error fetching flowers:', err);
      setError('Failed to load flowers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0].url;
    }
    if (product.image && product.image.startsWith('data:image')) {
      return product.image;
    }
    if (product.image && product.image.length > 200) {
      return `data:image/jpeg;base64,${product.image}`;
    }
    if (product.image) {
      return `http://localhost:5000/uploads/products/${product.image}`;
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };

  const getFlowerQuantity = (flowerId) => {
    const item = boxItems.find(item => item._id === flowerId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (boxItems.length === 0) {
      alert('Please add some flowers to your box first!');
      return;
    }

    // Add all box items to cart
    boxItems.forEach(item => {
      addToCart(item, item.quantity);
    });

    alert('Custom box added to cart!');
    clearBox();
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (boxItems.length === 0) {
      alert('Please add some flowers to your box first!');
      return;
    }

    // Add to cart and navigate to checkout
    boxItems.forEach(item => {
      addToCart(item, item.quantity);
    });

    clearBox();
    navigate('/checkout');
  };

  const categories = ['All', ...new Set(flowers.map(f => f.category))];
  const filteredFlowers = selectedCategory === 'All' 
    ? flowers 
    : flowers.filter(f => f.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 text-rose-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Create Your Custom Flower Box
            </h1>
            <p className="text-xl text-green-100 mb-2">
              Choose your favorite individual flowers and create a personalized arrangement
            </p>
            <p className="text-green-100">
              {flowers.length} flowers available | {getItemCount()} selected
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Flower Selection */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Flowers Grid */}
            {error ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : filteredFlowers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-600">No individual flowers available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredFlowers.map((flower) => {
                  const quantity = getFlowerQuantity(flower._id);
                  return (
                    <div
                      key={flower._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                    >
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={getImageUrl(flower)}
                          alt={flower.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          {flower.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{flower.name}</h3>
                        {flower.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{flower.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-green-600">
                            LKR {flower.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {flower.stock}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeFlower(flower._id)}
                              disabled={quantity === 0}
                              className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addFlower(flower)}
                              disabled={quantity >= flower.stock}
                              className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {quantity > 0 && (
                            <span className="text-sm font-medium text-green-600">
                              Added ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Items Preview (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Your Box</h2>
              </div>

              {boxItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No flowers selected yet</p>
                  <p className="text-sm text-gray-400 mt-2">Add flowers using + button</p>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
                    {boxItems.map(item => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">LKR {item.price.toFixed(2)} each</p>
                          <p className="text-sm font-medium text-green-600">
                            {item.quantity} × LKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => updateQuantity(item._id, 0)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-semibold">{getItemCount()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-800">Total Price:</span>
                      <span className="text-green-600">LKR {getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white border-2 border-green-500 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={clearBox}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      Clear Box
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateYourBoxPage;
