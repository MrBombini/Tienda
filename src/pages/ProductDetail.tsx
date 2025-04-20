import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Info, Truck, Shield, ChevronRight } from 'lucide-react';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'returns'>('description');
  const [addToCartAnimation, setAddToCartAnimation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await getProduct(parseInt(id));
          setProduct(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddToCartAnimation(true);
      setTimeout(() => setAddToCartAnimation(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-200 h-6 w-32 mb-8 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <div>
            <div className="bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
            <div className="bg-gray-200 h-6 w-1/4 mb-6 rounded"></div>
            <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-6 rounded"></div>
            <div className="bg-gray-200 h-10 w-1/3 mb-4 rounded"></div>
            <div className="bg-gray-200 h-12 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/products/category/${product.category}`} className="hover:text-blue-600 capitalize">
          {product.category}
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
            </span>
          </div>
          
          <p className="text-2xl font-bold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          
          <div className="flex items-center mb-6">
            <div className="relative flex items-center max-w-[8rem] border border-gray-300 rounded-lg mr-4">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center border-0 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 ${
                addToCartAnimation ? 'animate-pulse' : ''
              }`}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-start mb-2">
              <Info size={18} className="text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Category: <span className="text-gray-700 capitalize">{product.category}</span></p>
              </div>
            </div>
            <div className="flex items-start mb-2">
              <Truck size={18} className="text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Free shipping over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield size={18} className="text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">30-day money-back guarantee</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`pb-2 px-4 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`pb-2 px-4 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping
              </button>
              <button
                className={`pb-2 px-4 font-medium text-sm ${
                  activeTab === 'returns'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('returns')}
              >
                Returns
              </button>
            </div>
            
            <div className="text-gray-700">
              {activeTab === 'description' && (
                <p>{product.description}</p>
              )}
              
              {activeTab === 'shipping' && (
                <div>
                  <p className="mb-2">We offer the following shipping options:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Standard Shipping (3-5 business days): $4.99</li>
                    <li>Express Shipping (1-2 business days): $9.99</li>
                    <li>Free Standard Shipping on orders over $50</li>
                  </ul>
                </div>
              )}
              
              {activeTab === 'returns' && (
                <div>
                  <p className="mb-2">Our return policy:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>30-day money-back guarantee</li>
                    <li>Items must be in original condition with tags attached</li>
                    <li>Return shipping is the responsibility of the customer</li>
                    <li>Refunds are processed within 7-10 business days</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;