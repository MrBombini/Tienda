import React, { useState, useEffect } from 'react';
import { getCountries, getCountryInfo } from '../services/api';
import type { Country, CountryInfo } from '../types';

interface CountrySelectorProps {
  onCountrySelect: (countryInfo: CountryInfo) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const data = await getCountries();
        setCountries(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setError('Failed to load countries. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchCountryInfo = async () => {
        try {
          setIsLoading(true);
          const data = await getCountryInfo(selectedCountry);
          setCountryInfo(data);
          onCountrySelect(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch country info:', error);
          setError('Failed to load country information. Please try again later.');
          setIsLoading(false);
        }
      };

      fetchCountryInfo();
    }
  }, [selectedCountry, onCountrySelect]);

  return (
    <div className="mb-6">
      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Country
      </label>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <select
        id="country"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      >
        <option value="">Select a country</option>
        {countries.map((country, index) => (
          <option key={`${country.sISOCode}-${index}`} value={country.sISOCode}>
            {country.sName}
          </option>
        ))}
      </select>
      
      {isLoading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      
      {countryInfo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{countryInfo.sName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Capital:</span> {countryInfo.sCapitalCity}</p>
            <p><span className="font-medium">Phone Code:</span> +{countryInfo.sPhoneCode}</p>
            <p><span className="font-medium">Currency:</span> {countryInfo.sCurrencyISOCode}</p>
            <p><span className="font-medium">Continent:</span> {countryInfo.sContinentCode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;