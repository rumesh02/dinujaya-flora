import React, { useState } from 'react';
import { Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Collections', href: '#collections' },
    { name: 'Occasions', href: '#occasions' },
    { name: 'Events', href: '#events' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#contact' }
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img 
              src="/images/logo.jpg" 
              alt="Dinujaya Flora Logo" 
              className="h-14 w-14 object-cover rounded-full"
            />
            <div>
              <h1 className="text-3xl font-serif font-bold text-rose-700">
                Dinujaya Flora
              </h1>
              <p className="text-xs text-gray-500 tracking-widest">BEST FLORALS FOR YOU</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-700 hover:text-rose-600 transition-colors duration-300 relative">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-rose-600 transition-colors duration-300 relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="text-gray-700 hover:text-rose-600 transition-colors duration-300">
              <User className="w-6 h-6" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-rose-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
