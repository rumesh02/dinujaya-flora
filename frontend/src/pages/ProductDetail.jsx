import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Minus, Plus, Star } from 'lucide-react';
import { productService } from '../services';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      setProduct(response.data.data);
      setSelectedImage(response.data.data.image);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    addToCart(product, quantity);
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    addToCart(product, quantity);
    navigate('/cart');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-lg">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
              <button
                onClick={() => navigate('/flowers')}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
              >
                Browse All Flowers
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
      
      {/* Breadcrumb */}
      <div className="bg-white mt-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-rose-600">
              Home
            </button>
            <span className="mx-2">›</span>
            <button onClick={() => navigate('/flowers')} className="hover:text-rose-600">
              Flowers
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-800 capitalize">{product.category}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <div className="relative aspect-square">
                <img
                  src={selectedImage ? `http://localhost:5000/uploads/products/${selectedImage}` : '/images/default-flower.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-flower.jpg';
                  }}
                />
                
                {/* Badges */}
                {product.isBestseller && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Bestseller
                  </div>
                )}
                
                {product.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Supplier Info */}
            {product.supplier && (
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Vendor:</span> {product.supplier.name}
                </p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="inline-block bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-rose-600">
                  Rs {product.price?.toFixed(2)}
                </p>
              </div>

              {/* Stock Availability */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Availability:</span>{' '}
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Colors</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Occasions */}
              {product.occasion && product.occasion.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.occasion.map((occ, index) => (
                      <span
                        key={index}
                        className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Subtotal: <span className="font-semibold text-rose-600">Rs {(product.price * quantity).toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!user ? 'Login to Add' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-lg font-semibold transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {!user ? 'Login to Buy' : 'Buy Now'}
                </button>

                <button className="px-6 py-4 border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {!user && (
                <p className="text-sm text-center text-gray-500">
                  Please{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-rose-600 hover:underline font-medium"
                  >
                    login
                  </button>{' '}
                  to purchase flowers
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
