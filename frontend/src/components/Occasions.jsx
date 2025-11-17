import React from 'react';

const Occasions = () => {
  const occasions = [
    {
      name: "Weddings",
      image: "/images/occasion-wedding.jpg",
      description: "Make your special day unforgettable"
    },
    {
      name: "Birthdays",
      image: "/images/occasion-birthday.jpg",
      description: "Celebrate with vibrant blooms"
    },
    {
      name: "Anniversaries",
      image: "/images/occasion-anniversary.jpg",
      description: "Express your eternal love"
    },
    {
      name: "Sympathy",
      image: "/images/occasion-sympathy.jpg",
      description: "Honor and remember"
    },
    {
      name: "Congratulations",
      image: "/images/occasion-congrats.jpg",
      description: "Celebrate achievements"
    },
    {
      name: "Just Because",
      image: "/images/occasion-justbecause.jpeg",
      description: "Brighten someone's day"
    }
  ];

  return (
    <section id="occasions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-rose-600 font-medium tracking-widest uppercase mb-2">
            Perfect for Every Moment
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Shop by Occasion
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect arrangement for every celebration and milestone
          </p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion, index) => (
            <div
              key={index}
              className="relative h-80 rounded-xl overflow-hidden group cursor-pointer shadow-lg"
            >
              {/* Background Image */}
              <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500">
                <img 
                  src={occasion.image} 
                  alt={occasion.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif font-bold mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                  {occasion.name}
                </h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                  {occasion.description}
                </p>
                <button className="mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 flex items-center">
                  Shop Now 
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Occasions;
