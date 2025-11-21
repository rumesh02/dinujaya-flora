import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlowersPage = () => {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchFlowers();
  }, [selectedCategory]);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `http://localhost:5000/api/products?productType=flowers&category=${selectedCategory}&isAvailable=true`
        : 'http://localhost:5000/api/products?productType=flowers&isAvailable=true';
      
      const response = await axios.get(url);
      setFlowers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching flowers:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All Categories',
    'Roses',
    'Tulips',
    'Lilies',
    'Orchids',
    'Carnations',
    'Sunflowers',
    'Daisies',
    'Chrysanthemums',
    'Gerberas',
    'Peonies',
    'Hydrangeas',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Individual Flowers
          </h1>
          <p className="text-gray-600">
            {selectedCategory && selectedCategory !== 'All Categories'
              ? `Showing ${flowers.length} ${selectedCategory}`
              : `Browse our collection of ${flowers.length} beautiful individual flowers`
            }
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All Categories' ? '' : category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                (category === 'All Categories' && selectedCategory === '') ||
                category === selectedCategory
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your Custom Flower Box</h2>
              <p className="text-green-50">
                Choose your favorite flowers and create a personalized arrangement
              </p>
            </div>
            <button
              onClick={() => navigate('/create-flower-box')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all mt-4 md:mt-0"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Flowers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-green-500 animate-spin" />
          </div>
        ) : flowers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No flowers found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flowers.map(flower => (
              <FlowerCard key={flower._id} flower={flower} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FlowerCard = ({ flower }) => {
  const navigate = useNavigate();
  
  // Use first Cloudinary image if available
  const imageUrl = flower.images && flower.images.length > 0 
    ? flower.images[0].url 
    : flower.image || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div 
      onClick={() => navigate(`/product/${flower._id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={flower.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        {flower.isBestseller && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Popular
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {flower.name}
          </h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            {flower.category}
          </span>
        </div>
        
        {flower.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {flower.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            LKR {flower.price.toFixed(2)}
          </span>
          
          {flower.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">
              {flower.stock} available
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Color Options */}
        {flower.colors && flower.colors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Available Colors:</p>
            <div className="flex flex-wrap gap-2">
              {flower.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Occasions */}
        {flower.occasion && flower.occasion.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {flower.occasion.slice(0, 3).map((occ, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {occ}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowersPage;
