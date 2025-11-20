import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { productService } from '../services';
import FlowerCard from '../components/FlowerCard';

const Flowers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Bouquet', 'Arrangement', 'Single Stem', 'Plant'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: '/flowers' } });
      return;
    }

    // Add to cart and go to checkout
    handleAddToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Beautiful Flowers</h1>
          <p className="text-xl text-rose-100">
            Discover our stunning collection of fresh flowers
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search flowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-lg">Loading flowers...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No flowers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden group">
                  <img
                    src={product.image ? `http://localhost:5000/uploads/products/${product.image}` : '/images/default-flower.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/default-flower.jpg';
                    }}
                  />
                  
                  {/* Stock Badge */}
                  {product.stock === 0 ? (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </div>
                  ) : product.stock < 10 ? (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Low Stock
                    </div>
                  ) : null}

                  {/* Favorite Button */}
                  <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || 'Beautiful fresh flowers'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-rose-600">
                      LKR {product.price?.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : user
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={!user ? 'Login to add to cart' : 'Add to cart'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {!user ? 'Login to Add' : 'Add to Cart'}
                    </button>
                    
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      {!user ? 'Login to Buy' : 'Buy Now'}
                    </button>
                  </div>

                  {!user && (
                    <p className="text-xs text-center text-gray-500 mt-3">
                      Please login to purchase flowers
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Flowers;
