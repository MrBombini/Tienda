import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Award } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        // Get 8 random products for featured section
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 8));
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover Quality Products for Your Lifestyle
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shop the latest trends with our curated collection of premium products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/products/category/electronics"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                Explore Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Explore thousands of products across multiple categories.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your products delivered quickly and efficiently.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your transactions are protected with state-of-the-art security.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">We ensure all products meet our high quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products across different categories to find exactly what you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products/category/${category}`}
                className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600 opacity-80 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white capitalize px-4 text-center">{category}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white flex justify-between items-center">
                  <span className="text-gray-700 font-medium">View Products</span>
                  <ArrowRight className="h-5 w-5 text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
            >
              View All <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover our high-quality products today.
          </p>
          <Link
            to="/products"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;