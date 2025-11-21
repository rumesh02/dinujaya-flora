import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlowerCard from '../components/FlowerCard';
import { productService } from '../services';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';

const OccasionPage = () => {
  const { occasionName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [occasionName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getByOccasion(occasionName);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const getOccasionInfo = (occasion) => {
    const occasions = {
      'Wedding': {
        title: 'Wedding Flowers',
        description: 'Make your special day unforgettable with our elegant wedding arrangements',
        gradient: 'from-pink-400 to-rose-500'
      },
      'Birthday': {
        title: 'Birthday Flowers',
        description: 'Celebrate with vibrant blooms that bring joy and happiness',
        gradient: 'from-purple-400 to-pink-500'
      },
      'Anniversary': {
        title: 'Anniversary Flowers',
        description: 'Express your eternal love with romantic floral arrangements',
        gradient: 'from-red-400 to-rose-500'
      },
      'Sympathy': {
        title: 'Sympathy Flowers',
        description: 'Honor and remember with thoughtful, comforting arrangements',
        gradient: 'from-gray-400 to-slate-500'
      },
      'Love': {
        title: 'Love & Romance',
        description: 'Express your feelings with romantic bouquets',
        gradient: 'from-rose-400 to-pink-500'
      },
      'Congratulations': {
        title: 'Congratulations',
        description: 'Celebrate achievements and milestones',
        gradient: 'from-yellow-400 to-orange-500'
      },
      'Get Well': {
        title: 'Get Well Soon',
        description: 'Send healing wishes and brighten their day',
        gradient: 'from-green-400 to-teal-500'
      },
      'Thank You': {
        title: 'Thank You Flowers',
        description: 'Show your appreciation with beautiful blooms',
        gradient: 'from-blue-400 to-indigo-500'
      },
      'Other': {
        title: 'Special Occasions',
        description: 'Perfect flowers for any celebration',
        gradient: 'from-rose-400 to-pink-500'
      }
    };

    return occasions[occasion] || occasions['Other'];
  };

  const occasionInfo = getOccasionInfo(occasionName);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${occasionInfo.gradient} text-white py-20 mt-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-rose-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {occasionInfo.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {occasionInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-rose-600">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/#occasions')} className="hover:text-rose-600">Occasions</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{occasionInfo.title}</span>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-lg">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Available</h3>
            <p className="text-gray-500 text-lg mb-6">
              No products available for this occasion at the moment.
            </p>
            <button
              onClick={() => navigate('/flowers')}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Browse All Flowers
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
                </h2>
                <p className="text-gray-600 mt-1">Mix and match from our handpicked flowers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <FlowerCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OccasionPage;
