import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
          Stay in Bloom
        </h2>
        <p className="text-white text-lg mb-8 opacity-90">
          Subscribe to receive exclusive offers, seasonal collections, and floral inspiration
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
