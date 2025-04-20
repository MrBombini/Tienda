import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { getProducts, getProductsByCategory } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types';

const Products: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let data: Product[];
        
        if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getProducts();
        }
        
        setProducts(data);
        setFilteredProducts(data);
        
        // Find min and max price for range filter
        if (data.length > 0) {
          const prices = data.map(product => product.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Apply filters and search
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.title.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Default sorting (by id)
        result.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, priceRange, sortBy]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
          {searchQuery && ` - Search: "${searchQuery}"`}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button
          className="md:hidden flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-700"
          onClick={toggleFilters}
        >
          <SlidersHorizontal size={18} />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="sticky top-20 bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">${priceRange[0]}</span>
                  <span className="text-gray-600">${priceRange[1]}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min={0}
                    max={Math.ceil(Math.max(...products.map(p => p.price)))}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full accent-blue-600"
                  />
                  <input
                    type="range"
                    min={0}
                    max={Math.ceil(Math.max(...products.map(p => p.price)))}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                    min="0"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Products;