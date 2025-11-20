import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services';
import { Flower2, Gift, Trees, Sparkles } from 'lucide-react';

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await productService.getCollections();
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCollectionIcon = (collection) => {
    switch (collection) {
      case 'Bouquets':
        return <Flower2 className="w-12 h-12" />;
      case 'Indoor Plants':
        return <Trees className="w-12 h-12" />;
      case 'Wedding Décor':
        return <Sparkles className="w-12 h-12" />;
      case 'Gift Bundles':
        return <Gift className="w-12 h-12" />;
      default:
        return <Flower2 className="w-12 h-12" />;
    }
  };

  const getCollectionColor = (collection) => {
    switch (collection) {
      case 'Bouquets':
        return 'from-rose-400 to-pink-500';
      case 'Indoor Plants':
        return 'from-green-400 to-emerald-500';
      case 'Wedding Décor':
        return 'from-purple-400 to-pink-400';
      case 'Gift Bundles':
        return 'from-amber-400 to-orange-500';
      default:
        return 'from-rose-400 to-pink-500';
    }
  };

  const handleCollectionClick = (collection) => {
    navigate(`/collection/${collection}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return null; // Don't show section if no collections
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-rose-600 font-medium tracking-widest uppercase mb-2">
            Shop by Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Our Collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collections designed for every occasion and space
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection) => (
            <div
              key={collection}
              onClick={() => handleCollectionClick(collection)}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCollectionColor(collection)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-white shadow-md text-rose-600 group-hover:scale-110 transition-transform">
                  {getCollectionIcon(collection)}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {collection}
                </h3>
                
                {/* Button */}
                <button className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition-colors transform group-hover:scale-105">
                  Explore
                </button>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-100 rounded-bl-full opacity-50"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/flowers')}
            className="bg-white border-2 border-rose-600 text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-rose-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default Collections;
