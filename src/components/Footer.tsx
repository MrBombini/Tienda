import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ElegantStore</h3>
            <p className="text-gray-400 mb-4">
              Your destination for quality products with a seamless shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products/category/electronics" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/jewelery" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Jewelery
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/men's clothing" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/women's clothing" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women's Clothing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-gray-400 mr-2 mt-1" />
                <span className="text-gray-400">1234 Market St, San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-2" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gray-400 mr-2" />
                <span className="text-gray-400">support@elegantstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} ElegantStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;