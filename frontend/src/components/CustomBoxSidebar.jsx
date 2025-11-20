import React from 'react';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomBoxSidebar = ({ boxItems, onRemove, onUpdateQuantity, onClearBox, getTotal }) => {
  const navigate = useNavigate();

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
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const handleCheckout = () => {
    if (boxItems.length === 0) {
      alert('Please add at least one flower to your custom box');
      return;
    }
    navigate('/checkout-custom-box');
  };

  const totalItems = boxItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotal();

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="text-lg font-bold">Your Custom Box</h3>
          </div>
          {boxItems.length > 0 && (
            <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {boxItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-2">Your custom box is empty</p>
            <p className="text-gray-400 text-xs">Add flowers using + button</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {boxItems.map((item) => (
                <div key={item.product._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Thumbnail */}
                  <img
                    src={getImageUrl(item.product)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">{item.product.category}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold text-gray-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemove(item.product._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove from box"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-2 text-right">
                      <span className="text-sm font-bold text-pink-600">
                        LKR {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Box Button */}
            {boxItems.length > 0 && (
              <button
                onClick={onClearBox}
                className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Box
              </button>
            )}

            {/* Total Section */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">LKR {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-pink-600">LKR {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Continue to checkout to complete your custom flower box
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomBoxSidebar;
