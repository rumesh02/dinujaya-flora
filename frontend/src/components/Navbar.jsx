import React, { useState, useRef, useEffect } from 'react';
import { Heart, ShoppingCart, User, Menu, X, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const userMenuRef = useRef(null);
  const collectionsMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  // Fetch categories from database
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/categories/list');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '#collections' },
    { name: 'Create Your Box', href: '/create-flower-box' },
    { name: 'Occasions', href: '/#occasions' },
    { name: 'Events', href: '/events' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/#contact' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (collectionsMenuRef.current && !collectionsMenuRef.current.contains(event.target)) {
        setIsCollectionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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
            {/* Collections Dropdown */}
            <div className="relative" ref={collectionsMenuRef}>
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase flex items-center gap-1"
              >
                COLLECTIONS
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCollectionsOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          navigate(`/collections/${category}`);
                          setIsCollectionsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        {category}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories available
                    </div>
                  )}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => {
                        navigate('/flowers');
                        setIsCollectionsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {navItems.filter(item => item.name !== 'Collections').map((item) => {
              const isLink = item.href.startsWith('/') && !item.href.includes('#');
              const isHashLink = item.href.includes('#');
              
              if (isLink) {
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
                  >
                    {item.name}
                  </button>
                );
              }

              if (isHashLink) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (window.location.pathname !== '/') {
                        navigate(item.href);
                      } else {
                        const sectionId = item.href.replace('/#', '').replace('#', '');
                        const element = document.getElementById(sectionId);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
                  >
                    {item.name}
                  </button>
                );
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-700 hover:text-rose-600 transition-colors duration-300 relative">
              <Heart className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="text-gray-700 hover:text-rose-600 transition-colors duration-300 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-rose-600 transition-colors duration-300"
              >
                <User className="w-6 h-6" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => {
                            navigate('/admin/dashboard');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          Admin Dashboard
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate('/flowers');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            Shop Flowers
                          </button>
                          <button
                            onClick={() => {
                              navigate('/profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            My Orders
                          </button>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/register');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

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
