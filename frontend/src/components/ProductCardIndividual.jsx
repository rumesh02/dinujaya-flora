import React from 'react';
import { Plus, Minus } from 'lucide-react';

const ProductCardIndividual = ({ product, quantity, onAdd, onRemove }) => {
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

  const isOutOfStock = product.stock === 0;
  const hasReachedMax = quantity >= product.stock;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
        
        {quantity > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            ✓ Added {quantity}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{product.category}</p>
        
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-pink-600">
              LKR {product.price.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          {quantity === 0 ? (
            <button
              onClick={onAdd}
              disabled={isOutOfStock}
              className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add to Box
            </button>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                onClick={onRemove}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex-1 bg-gray-100 py-2 rounded-lg text-center">
                <span className="text-lg font-bold text-gray-800">{quantity}</span>
              </div>
              
              <button
                onClick={onAdd}
                disabled={hasReachedMax}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  hasReachedMax
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {hasReachedMax && quantity > 0 && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            Maximum stock reached
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCardIndividual;
