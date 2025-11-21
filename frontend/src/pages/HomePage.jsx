import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import Features from '../components/Features.jsx';
import Collections from '../components/Collections.jsx';
import PopularBouquets from '../components/PopularBouquets.jsx';
import Occasions from '../components/Occasions.jsx';
import Newsletter from '../components/Newsletter.jsx';
import Footer from '../components/Footer.jsx';
import FlowerCard from '../components/FlowerCard.jsx';
import { productService } from '../services';
import { useCart } from '../context/CartContext.jsx';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const selectedCollection = searchParams.get('collection');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  // Handle scroll to contact section
  useEffect(() => {
    if (location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCollection) {
      fetchFilteredProducts();
    }
  }, [selectedCollection]);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getByCollection(selectedCollection);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  if (selectedCollection) {
    return (
      <div className="App">
        <Navbar />
        
        {/* Filtered Collection Section */}
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">
              {selectedCollection}
            </h1>
            <p className="text-xl text-rose-100">
              Explore our beautiful collection
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Available</h3>
              <p className="text-gray-500 text-lg mb-6">
                No products available in this collection at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
  }

  return (
    <div className="App">
      <Navbar />
      <HeroSlideshow />
      <Features />
      <Collections />
      <PopularBouquets />
      <Occasions />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
