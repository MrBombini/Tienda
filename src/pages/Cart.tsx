import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart: React.FC = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            It looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={18} className="mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-4">
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {totalPrice >= 50 ? 'Free' : '$4.99'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${(
                      totalPrice +
                      (totalPrice >= 50 ? 0 : 4.99) +
                      totalPrice * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-3 px-4 rounded-lg"
            >
              Proceed to Checkout
            </Link>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Secure checkout provided by trusted payment processors.</p>
              <p>We accept all major credit cards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;