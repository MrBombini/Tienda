import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CountrySelector from '../components/CountrySelector';
import type { CountryInfo } from '../types';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

const Checkout: React.FC = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleCountrySelect = (countryInfo: CountryInfo) => {
    setSelectedCountry(countryInfo);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!selectedCountry) newErrors.country = 'Please select a country';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 'information') {
      if (validateForm()) {
        setCurrentStep('shipping');
      }
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Simulate successful payment
      setCurrentStep('confirmation');
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
      }, 1000);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${currentStep === 'information' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'information' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-xs font-medium">Information</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
            <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-xs font-medium">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
            <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'payment' || currentStep === 'confirmation' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-xs font-medium">Payment</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
            <div className={`flex flex-col items-center ${currentStep === 'confirmation' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                4
              </div>
              <span className="text-xs font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Information Step */}
        {currentStep === 'information' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code*
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
              </div>
              
              <div>
                <CountrySelector onCountrySelect={handleCountrySelect} />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {currentStep === 'shipping' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
            
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <input
                  type="radio"
                  id="standard"
                  name="shipping"
                  checked
                  className="mt-1"
                  readOnly
                />
                <label htmlFor="standard" className="ml-3 flex-1">
                  <span className="block text-sm font-medium text-gray-800">Standard Shipping</span>
                  <span className="block text-sm text-gray-500">3-5 business days</span>
                  <span className="mt-1 block text-sm font-medium text-gray-800">
                    {totalPrice >= 50 ? 'Free' : '$4.99'}
                  </span>
                </label>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <input
                  type="radio"
                  id="express"
                  name="shipping"
                  className="mt-1"
                />
                <label htmlFor="express" className="ml-3 flex-1">
                  <span className="block text-sm font-medium text-gray-800">Express Shipping</span>
                  <span className="block text-sm text-gray-500">1-2 business days</span>
                  <span className="mt-1 block text-sm font-medium text-gray-800">$9.99</span>
                </label>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <span className="font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </p>
              <p className="text-gray-600">{formData.address}</p>
              <p className="text-gray-600">
                {formData.city}, {formData.postalCode}
              </p>
              <p className="text-gray-600">{selectedCountry?.sName}</p>
              {formData.phone && <p className="text-gray-600">{formData.phone}</p>}
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="flex items-center mb-6">
              <CreditCard size={24} className="text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Credit Card</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="123"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="nameOnCard"
                  placeholder="John Doe"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <ShieldCheck size={18} className="text-green-500 mr-2" />
              Your payment information is secure and encrypted
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totalPrice >= 50 ? 'Free' : '$4.99'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
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
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === 'confirmation' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. We've sent an order confirmation to {formData.email}.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600 mb-1">Order #: {Math.floor(100000 + Math.random() * 900000)}</p>
              <p className="text-sm text-gray-600">Order Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep !== 'confirmation' && (
          <div className="mt-6 flex justify-end">
            {currentStep !== 'information' && (
              <button
                onClick={() => setCurrentStep((prev) => 
                  prev === 'shipping' ? 'information' : 
                  prev === 'payment' ? 'shipping' : 'information'
                )}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors mr-4"
              >
                Back
              </button>
            )}
            
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === 'payment' ? 'Place Order' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;