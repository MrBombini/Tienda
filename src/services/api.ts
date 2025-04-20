import axios from 'axios';
import type { Product, Country, CountryInfo } from '../types';

const API_URL = 'http://localhost:5000/api';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`);
  return response.data as Product[];
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${API_URL}/products/categories`);
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products/category/${category}`);
  return response.data;
};

export const getCountries = async (): Promise<Country[]> => {
  const response = await axios.get<Country[]>(`${API_URL}/countries`);
  return response.data;
};

export const getCountryInfo = async (code: string): Promise<CountryInfo> => {
  const response = await axios.get<CountryInfo>(`${API_URL}/country/${code}`);
  return response.data;
};