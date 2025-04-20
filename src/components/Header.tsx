import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { getCategories } from '../services/api';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ElegantStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600">
                Categories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/products/category/${category}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 capitalize"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              All Products
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <Search size={18} />
              </button>
            </form>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                Home
              </Link>
              <div className="py-2">
                <p className="text-gray-700 font-medium mb-2">Categories</p>
                <div className="ml-4 flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/products/category/${category}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-600 hover:text-blue-600 capitalize"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2"
              >
                All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;