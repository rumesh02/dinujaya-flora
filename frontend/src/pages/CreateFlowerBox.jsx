import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';
import { useCustomBox } from '../context/CustomBoxContext';
import FlowerSelectionCard from '../components/FlowerSelectionCard';
import BoxSummaryPanel from '../components/BoxSummaryPanel';
import { productService } from '../services';

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
      const response = await productService.getAll();
      
      // Filter only products with productType='flowers'
      const individualFlowers = response.data.filter(
        product => product.productType === 'flowers' && product.isAvailable && product.stock > 0
      );
      
      setFlowers(individualFlowers);
    } catch (error) {
      console.error('Error fetching flowers:', error);
      setError('Failed to load flowers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlower = (flower, quantity) => {
    addFlower(flower, quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8">
      <div className="container mx-auto px-4">
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
                  <FlowerSelectionCard
                    key={flower._id}
                    flower={flower}
                    onAdd={handleAddFlower}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Box Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <BoxSummaryPanel
              boxItems={boxItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFlower}
              onClear={clearBox}
              total={getBoxTotal()}
              count={getBoxCount()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFlowerBox;
