import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-rose-400 mb-4">
              Dinujaya Flora
            </h3>
            <p className="text-gray-400 mb-4">
              Creating timeless floral arrangements that celebrate life's most precious moments with elegance and artistry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#collections" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#occasions" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Occasions
                </a>
              </li>
              <li>
                <a href="#events" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-rose-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Care Instructions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  27/1 School Lane, Piliyandala
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">
                  +94 77 346 4210
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">
                  dinujayaflora@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Dinujaya Flora. All rights reserved. Crafted with love and passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
