import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Heart } from 'lucide-react';

const FlowerCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(product);
    }
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    // Favorite logic here
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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
        
        {/* Badges */}
        {product.isBestseller && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Bestseller
          </div>
        )}
        
        {product.stock === 0 ? (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        ) : product.stock < 10 && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Low Stock
          </div>
        )}

        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
        >
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
            Rs.{product.price?.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
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
            {!user ? 'Login' : 'Add'}
          </button>
          
          <button
            onClick={handleBuyNow}
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
            Please login to purchase
          </p>
        )}
      </div>
    </div>
  );
};

export default FlowerCard;
