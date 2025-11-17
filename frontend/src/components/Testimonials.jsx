import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Perera",
      role: "Bride",
      content: "Dinujaya Flora made my wedding day absolutely magical. The floral arrangements were beyond my wildest dreams!",
      rating: 5
    },
    {
      name: "Dineli Fernando",
      role: "Customer",
      content: "The quality and freshness of their flowers are unmatched. My wife was thrilled with the anniversary bouquet!",
      rating: 5
    },
    {
      name: "Kevin Silva",
      role: "Event Planner",
      content: "I've worked with many florists, but Dinujaya Flora's attention to detail and creativity is exceptional.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-rose-600 font-medium tracking-widest uppercase mb-2">
            Customer Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
