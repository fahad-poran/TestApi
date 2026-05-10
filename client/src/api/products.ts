const API_URL = 'http://localhost:5149/api';

// Mock data
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Organic Apples', price: 2.99, description: 'Fresh organic apples from local farm', categoryId: 1 },
  { id: 2, name: 'Whole Grain Bread', price: 3.49, description: 'Freshly baked whole grain bread', categoryId: 2 },
  { id: 3, name: 'Free Range Eggs', price: 4.99, description: 'Dozen free-range eggs', categoryId: 1 },
  { id: 4, name: 'Almond Milk', price: 3.99, description: 'Unsweetened almond milk 1L', categoryId: 3 },
  { id: 5, name: 'Greek Yogurt', price: 5.49, description: 'Organic Greek yogurt 500g', categoryId: 3 }
];

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId?: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description?: string;
  categoryId?: number;
  initialStock?: number;
}

export const getProducts = async (token: string | null): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/Products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.log('Using mock product data');
    return MOCK_PRODUCTS;
  }
};

export const createProduct = async (product: CreateProductInput, token: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/Products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create product');
  }
  return response.json();
};

export const updateProduct = async (id: number, product: CreateProductInput, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('Failed to update product');
};

export const deleteProduct = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete product');
};
