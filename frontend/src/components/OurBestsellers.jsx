import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Base64FlowerCard from './Base64FlowerCard';

const OurBestsellers = () => {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/flowers');
      
      if (response.data.success) {
        setFlowers(response.data.data);
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

  const handleFlowerClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-pink-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchFlowers}
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (flowers.length === 0) {
    return (
      <div className="py-16 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Bestsellers</h2>
            <p className="text-gray-600">No flowers available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Bestsellers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our most popular flowers, handpicked for their beauty and freshness
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        {/* Flowers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flowers.map(flower => (
            <Base64FlowerCard
              key={flower._id}
              id={flower._id}
              name={flower.name}
              price={flower.price}
              image={flower.image}
              description={flower.description}
              category={flower.category}
              collection={flower.collection}
              onClick={handleFlowerClick}
            />
          ))}
        </div>

        {/* View All Button */}
        {flowers.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/flowers')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
            >
              View All Flowers
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurBestsellers;
