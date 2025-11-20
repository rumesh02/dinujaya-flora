import React, { useState, useEffect } from 'react';
import { Flower2, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCardIndividual from '../components/ProductCardIndividual';
import CustomBoxSidebar from '../components/CustomBoxSidebar';
import { useCustomBox } from '../context/CustomBoxContext';

const CreateFlowerBox = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { boxItems, addFlower, removeFlower, updateQuantity, clearBox, getBoxTotal, getBoxCount } = useCustomBox();

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch ONLY individual flowers (not bouquets)
      const response = await axios.get('http://localhost:5000/api/products?type=individual&isAvailable=true');
      
      if (response.data.success) {
        const individualFlowers = response.data.data.filter(
          product => product.productType === 'individual' && product.stock > 0
        );
        setFlowers(individualFlowers);
      } else {
        setError('Failed to load flowers');
      }
    } catch (error) {
      console.error('Error fetching flowers:', error);
      setError('Failed to load flowers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlower = (flower) => {
    addFlower(flower, 1);
  };

  const handleRemoveFlower = (flowerId) => {
    const item = boxItems.find(i => i.product._id === flowerId);
    if (item && item.quantity > 1) {
      updateQuantity(flowerId, item.quantity - 1);
    } else {
      removeFlower(flowerId);
    }
  };

  const getFlowerQuantity = (flowerId) => {
    const item = boxItems.find(i => i.product._id === flowerId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flower2 className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Create Your Own Flower Box
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Build a personalized bouquet by selecting your favorite flowers and customizing quantities
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Flower Selection (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Flowers</h2>
              <p className="text-gray-600 mb-4">Choose from our collection of fresh individual flowers</p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="text-gray-600 mt-4">Loading flowers...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchFlowers}
                  className="mt-2 text-red-600 hover:text-red-700 font-semibold underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && flowers.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <Flower2 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-700 text-lg font-semibold mb-2">No Individual Flowers Available</p>
                <p className="text-gray-600">
                  We don't have any individual flowers in stock right now. Please check back later!
                </p>
              </div>
            )}

            {!loading && !error && flowers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {flowers.map((flower) => (
                  <ProductCardIndividual
                    key={flower._id}
                    product={flower}
                    quantity={getFlowerQuantity(flower._id)}
                    onAdd={() => handleAddFlower(flower)}
                    onRemove={() => handleRemoveFlower(flower._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Box Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <CustomBoxSidebar
              boxItems={boxItems}
              onRemove={removeFlower}
              onUpdateQuantity={updateQuantity}
              onClearBox={clearBox}
              getTotal={getBoxTotal}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateFlowerBox;
