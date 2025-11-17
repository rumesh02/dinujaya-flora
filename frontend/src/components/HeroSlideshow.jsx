import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Exquisite Floral Arrangements",
      subtitle: "Handcrafted with Love & Elegance",
      description: "Discover our premium collection of luxury bouquets for every special moment",
      image: "/images/hero-1.jpeg",
      cta: "Shop Collections"
    },
    {
      title: "Celebrate Life's Precious Moments",
      subtitle: "Unforgettable Blooms for Every Occasion",
      description: "From weddings to anniversaries, we create memories that last forever",
      image: "/images/hero-2.jpg",
      cta: "Explore Occasions"
    },
    {
      title: "Timeless Beauty, Delivered Fresh",
      subtitle: "Premium Flowers, Same Day Delivery",
      description: "Experience the finest selection of fresh flowers delivered to your doorstep",
      image: "/images/hero-3.jpeg",
      cta: "Order Now"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden mt-20">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center px-4">
              <p className="text-rose-300 font-medium tracking-widest uppercase mb-4 animate-fade-in">
                {slide.subtitle}
              </p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-slide-up">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto animate-fade-in">
                {slide.description}
              </p>
              <button className="bg-rose-600 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-3 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-3 rounded-full transition-all duration-300 shadow-lg"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-rose-600 w-8'
                : 'bg-white bg-opacity-50 hover:bg-opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
