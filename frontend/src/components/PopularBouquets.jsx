import React, { useState, useEffect } from 'react';
import FlowerCard from './FlowerCard';
import { productService } from '../services';
import { useCart } from '../context/CartContext';

const PopularBouquets = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      console.log('Fetching bestsellers from API...');
      const response = await productService.getBestsellers();
      console.log('Bestsellers response:', response.data);
      
      let products = response.data.products || [];
      
      // If no bestsellers, fetch regular products from Bouquets collection
      if (products.length === 0) {
        console.log('No bestsellers found, fetching all products...');
        const allProductsResponse = await productService.getAll();
        console.log('All products response:', allProductsResponse.data);
        // Get first 8 products
        products = (allProductsResponse.data.data || []).slice(0, 8);
      }
      
      setBestsellers(products);
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rose-600 font-medium tracking-widest uppercase mb-2">
              Our Bestsellers
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
              Most Popular Bouquets
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our customers' favorites - handpicked blooms arranged with artistry and care
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bestsellers...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-rose-600 font-medium tracking-widest uppercase mb-2">
            Our Bestsellers
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Most Popular Bouquets
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our customers' favorites - handpicked blooms arranged with artistry and care
          </p>
        </div>

        {/* Bouquets Grid */}
        {bestsellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map((product) => (
              <FlowerCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bestsellers Available</h3>
            <p className="text-gray-600">No bestsellers available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for our popular bouquets!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => window.location.href = '/flowers'}
            className="bg-white border-2 border-rose-600 text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-rose-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Collections
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularBouquets;
