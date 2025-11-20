import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FlowerSelectionCard = ({ flower, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < flower.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    onAdd(flower, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 bg-gray-100">
        <img
          src={flower.image || 'https://via.placeholder.com/300x300?text=Flower'}
          alt={flower.name}
          className="w-full h-full object-cover"
        />
        {flower.stock <= 5 && flower.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Only {flower.stock} left
          </span>
        )}
        {flower.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{flower.name}</h3>
        <p className="text-pink-600 font-bold text-xl mb-3">LKR {flower.price}</p>

        {flower.colors && flower.colors.length > 0 && (
          <div className="flex gap-2 mb-3">
            {flower.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= flower.stock}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={flower.stock === 0}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Box
        </button>
      </div>
    </div>
  );
};

export default FlowerSelectionCard;
