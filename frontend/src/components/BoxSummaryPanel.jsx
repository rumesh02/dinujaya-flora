import React from 'react';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BoxSummaryPanel = ({ boxItems, onUpdateQuantity, onRemove, onClear, total, count }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/create-flower-box' } });
      return;
    }
    navigate('/checkout-custom-box');
  };

  if (boxItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800">Your Flower Box</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-pink-300" />
          </div>
          <p className="text-gray-500 mb-2">Your box is empty</p>
          <p className="text-sm text-gray-400">Start adding flowers to create your custom bouquet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800">Your Flower Box</h2>
        </div>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="mb-4">
        <div className="bg-pink-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">Total Items: <span className="font-semibold text-pink-600">{count}</span></p>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
          {boxItems.map((item) => (
            <div key={item._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.image || 'https://via.placeholder.com/80x80?text=Flower'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h3>
                <p className="text-pink-600 font-bold text-sm mb-2">LKR {item.price}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onRemove(item._id)}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
          <span className="text-2xl font-bold text-pink-600">LKR {total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
        >
          Proceed to Checkout
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          {!user && 'You will be asked to login before checkout'}
        </p>
      </div>
    </div>
  );
};

export default BoxSummaryPanel;
