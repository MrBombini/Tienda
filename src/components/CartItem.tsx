import React from 'react';
import { Link } from 'react-router-dom';
import { Trash, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-4 border-b border-gray-200">
      <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mr-4 mb-4 md:mb-0 flex-shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
      </div>
      
      <div className="flex-grow md:mr-4">
        <Link 
          to={`/product/${item.id}`}
          className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
        >
          {item.title}
        </Link>
        <p className="text-sm text-gray-500 capitalize mt-1 mb-2">{item.category}</p>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrement}
              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-1 text-center min-w-[40px]">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-600 transition-colors flex items-center"
            aria-label="Remove item"
          >
            <Trash size={16} className="mr-1" />
            <span>Remove</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 self-end md:self-center text-right">
        <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>
    </div>
  );
};

export default CartItem;