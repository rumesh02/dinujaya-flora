import React from 'react';
import { Truck, Award, Clock, HeadphonesIcon } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Delivery",
      description: "On orders over Rs.5000"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "100% fresh guarantee"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Same Day Delivery",
      description: "Order before 2 PM"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Dedicated customer care"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-rose-50 transition-colors duration-300"
            >
              <div className="text-rose-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
