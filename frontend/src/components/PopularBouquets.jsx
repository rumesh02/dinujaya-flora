import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const PopularBouquets = () => {
  const bouquets = [
    {
      id: 1,
      name: "Romantic Rose Elegance",
      price: 3900,
      image: "/images/bouquet-1.jpg",
      rating: 5,
      reviews: 124,
      bestseller: true
    },
    {
      id: 2,
      name: "Spring Garden Delight",
      price: 3200,
      image: "/images/bouquet-2.jpg",
      rating: 5,
      reviews: 98
    },
    {
      id: 3,
      name: "Luxury Lily Collection",
      price: 9900,
      image: "/images/bouquet-3.jpg",
      rating: 5,
      reviews: 156,
      bestseller: true
    },
    {
      id: 4,
      name: "Pastel Dream Arrangement",
      price: 6900,
      image: "/images/bouquet-4.jpg",
      rating: 5,
      reviews: 87
    },
    {
      id: 5,
      name: "Sunflower Sunshine",
      price: 2000,
      image: "/images/bouquet-5.jpg",
      rating: 4,
      reviews: 72
    },
    {
      id: 6,
      name: "Exotic Orchid Paradise",
      price: 12900,
      image: "/images/bouquet-6.jpg",
      rating: 5,
      reviews: 203,
      bestseller: true
    },
    {
      id: 7,
      name: "Vintage Charm Bouquet",
      price: 2000,
      image: "/images/bouquet-7.jpg",
      rating: 5,
      reviews: 115
    },
    {
      id: 8,
      name: "Wildflower Wonder",
      price: 1500,
      image: "/images/bouquet-8.jpg",
      rating: 4,
      reviews: 64
    }
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bouquets.map((bouquet) => (
            <div
              key={bouquet.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              {/* Image Container */}
              <div className="relative h-72 bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
                {bouquet.bestseller && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                    Bestseller
                  </div>
                )}
                
                {/* Placeholder for image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm group-hover:scale-110 transition-transform duration-300">
                  {bouquet.image}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white p-2 rounded-full shadow-lg hover:bg-rose-50 transition-colors">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-rose-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-rose-700 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Bouquet Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {bouquet.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < bouquet.rating ? 'fill-current' : 'stroke-current fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({bouquet.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-rose-600">
                    Rs.{bouquet.price}
                  </p>
                  <button className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-rose-600 text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-rose-600 hover:text-white transition-all duration-300 transform hover:scale-105">
            View All Collections
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularBouquets;
