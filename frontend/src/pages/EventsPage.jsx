import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';

const EventsPage = () => {
  const events = [
    {
      title: "Weddings",
      category: "Wedding",
      date: "Year-Round Services",
      location: "Sri Lanka & Destination Weddings",
      attendees: "50-500 Guests",
      description: "Make your special day unforgettable with our exquisite wedding floral arrangements. From elegant bridal bouquets to stunning ceremony decorations and reception centerpieces, we create magical moments that last a lifetime.",
      highlights: [
        "Custom bridal bouquets & bridesmaids arrangements",
        "Ceremony arch & aisle decorations",
        "Reception centerpieces & table arrangements",
        "Wedding car floral decorations"
      ],
      images: [
        "/images/occasion-wedding.jpg",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800"
      ]
    },
    {
      title: "Corporate Events",
      category: "Corporate",
      date: "Throughout the Year",
      location: "Hotels, Offices & Conference Halls",
      attendees: "20-1000+ Guests",
      description: "Elevate your corporate events with professional floral arrangements. Whether it's a product launch, annual gala, or business conference, our corporate event florals add sophistication and elegance to your professional gatherings.",
      highlights: [
        "Stage & podium floral arrangements",
        "Welcome desk & lobby decorations",
        "Table centerpieces for gala dinners",
        "Corporate gift bouquets"
      ],
      images: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
      ]
    },
    {
      title: "Birthday Celebrations",
      category: "Birthday",
      date: "Every Day of the Year",
      location: "Homes, Venues & Outdoor Spaces",
      attendees: "Intimate to Large Parties",
      description: "Celebrate another year of life with vibrant and joyful birthday floral arrangements. From milestone birthdays to intimate gatherings, we create colorful displays that add happiness and beauty to every celebration.",
      highlights: [
        "Colorful birthday bouquets",
        "Balloon & flower combinations",
        "Birthday cake table arrangements",
        "Age-appropriate themed florals"
      ],
      images: [
        "/images/occasion-birthday.jpg",
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-12 h-12" />
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Our Events
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              From intimate gatherings to grand celebrations, we bring beauty and elegance to every occasion with our expert floral design services
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Flowers for Every Celebration
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our signature event floral services designed to make your special moments truly memorable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Planning an Event?</h3>
          <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
            Let us help you create a stunning floral experience for your next celebration. Contact our event planning team today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Request a Quote
            </button>
            <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors border-2 border-white">
              View Portfolio
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
