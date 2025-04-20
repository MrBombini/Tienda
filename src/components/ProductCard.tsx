import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="h-64 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.rating.rate)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.category}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;