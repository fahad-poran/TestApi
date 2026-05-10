import { Product } from './products';

// Mock data
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Produce', description: 'Fresh fruits and vegetables' },
  { id: 2, name: 'Bakery', description: 'Bread, pastries, and baked goods' },
  { id: 3, name: 'Dairy', description: 'Milk, cheese, yogurt, and eggs' }
];

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const getCategories = async (token: string): Promise<Category[]> => {
  try {
    const response = await fetch('http://localhost:5149/api/Categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  } catch (error) {
    console.log('Using mock category data');
    return MOCK_CATEGORIES;
  }
};

export const createCategory = async (category: Omit<Category, 'id'>, token: string): Promise<Category> => {
  try {
    const response = await fetch('http://localhost:5149/api/Categories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  } catch (error) {
    // Mock creation
    const newCategory = { ...category, id: Date.now() } as Category;
    MOCK_CATEGORIES.push(newCategory);
    return newCategory;
  }
};
