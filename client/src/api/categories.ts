import { Product } from './products';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const getCategories = async (token: string): Promise<Category[]> => {
  const response = await fetch('http://localhost:5001/api/Categories', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const createCategory = async (category: Omit<Category, 'id'>, token: string): Promise<Category> => {
  const response = await fetch('http://localhost:5001/api/Categories', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(category)
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};
