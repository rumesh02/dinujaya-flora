import React from 'react';
import { Heart, Award, Users, Leaf, Clock, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Florals",
      description: "Every arrangement we create is crafted with love and dedication to bringing beauty into your life."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Excellence",
      description: "We source only the freshest, highest-quality flowers from trusted local and international growers."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to exceed your floral expectations."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "We're committed to sustainable practices, using eco-friendly packaging and supporting local growers."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Timely Delivery",
      description: "We ensure your flowers arrive fresh and on time, every time, for all your important moments."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Reliability",
      description: "With years of experience, we've built a reputation for dependable service and beautiful results."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-96 mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Dinujaya Flora</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Bringing Beauty and Joy Through Flowers Since [Year]
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Dinujaya Flora was born from a simple passion: the love of flowers and the joy they bring to people's lives. What started as a small family venture has blossomed into one of Sri Lanka's most trusted flower shops.
              </p>
              <p>
                For over a decade, we've been dedicated to providing the freshest, most beautiful floral arrangements for every occasion. From intimate celebrations to grand events, we take pride in creating memorable experiences through the art of floristry.
              </p>
              <p>
                Our team of skilled florists combines traditional techniques with modern design aesthetics to create stunning arrangements that capture the essence of your special moments.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800"
                alt="Flower Shop"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-pink-500 text-white p-6 rounded-xl shadow-xl">
              <div className="text-4xl font-bold">10+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl border border-pink-100">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To bring happiness and beauty into the lives of our customers by providing exceptional floral arrangements and outstanding service. We strive to make every occasion special and every moment memorable through the timeless gift of flowers.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be Sri Lanka's most beloved and trusted flower shop, known for our creativity, quality, and commitment to customer satisfaction. We envision a world where flowers continue to bring people together and express emotions that words cannot.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Customers Trust Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover what makes Dinujaya Flora the preferred choice for flower enthusiasts across Sri Lanka
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl p-12 text-center text-white mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-sm md:text-base text-white/80">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-sm md:text-base text-white/80">Events Decorated</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-sm md:text-base text-white/80">Flower Varieties</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-sm md:text-base text-white/80">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Expert Team</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Meet the passionate florists and designers who bring your floral visions to life
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {['1560250097', '1573496360', '1573497019'].map((photoId, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-3 aspect-h-4 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${photoId}-0b93528c311a?w=400`}
                    alt={`Team Member ${index + 1}`}
                    className="object-cover w-full h-80 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Expert Florist</h3>
                <p className="text-gray-600">Master Floral Designer</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
