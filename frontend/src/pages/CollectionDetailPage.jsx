import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlowerCard from '../components/FlowerCard';
import { productService } from '../services';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';

const CollectionDetailPage = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [collectionName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getByCollection(collectionName);
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

  const getCollectionDescription = (collection) => {
    switch (collection) {
      case 'Bouquets':
        return 'Beautiful hand-tied bouquets crafted with fresh, premium flowers';
      case 'Indoor Plants':
        return 'Bring nature indoors with our selection of vibrant, easy-to-care-for plants';
      case 'Wedding Décor':
        return 'Elegant floral arrangements to make your special day unforgettable';
      case 'Gift Bundles':
        return 'Thoughtfully curated gift sets perfect for any occasion';
      default:
        return 'Explore our beautiful collection';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-20 mt-20">
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
              {collectionName}
            </h1>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto">
              {getCollectionDescription(collectionName)}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              No products available in this collection at the moment.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
              </h2>
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

export default CollectionDetailPage;
