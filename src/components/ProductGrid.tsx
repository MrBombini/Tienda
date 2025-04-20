import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;