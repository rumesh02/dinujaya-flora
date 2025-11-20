import React from 'react';
import PropTypes from 'prop-types';

const Base64FlowerCard = ({ id, name, price, image, description, category, collection, onClick }) => {
  // Convert Base64 string to displayable image source
  const getImageSrc = () => {
    if (!image) {
      return 'https://via.placeholder.com/300x400?text=No+Image';
    }
    
    // Check if image already has data:image prefix
    if (image.startsWith('data:image')) {
      return image;
    }
    
    // Add data:image/jpeg;base64, prefix for Base64 strings
    return `data:image/jpeg;base64,${image}`;
  };

  return (
    <div
      onClick={() => onClick && onClick(id)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={getImageSrc()}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=Image+Error';
          }}
        />
        
        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {category}
          </span>
        )}

        {/* Collection Badge */}
        {collection && (
          <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {collection}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Flower Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Price</span>
            <p className="text-2xl font-bold text-pink-600">
              LKR {typeof price === 'number' ? price.toFixed(2) : price}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(id);
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

Base64FlowerCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
  category: PropTypes.string,
  collection: PropTypes.string,
  onClick: PropTypes.func
};

Base64FlowerCard.defaultProps = {
  description: '',
  category: '',
  collection: '',
  onClick: null
};

export default Base64FlowerCard;
