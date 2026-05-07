const API_URL = 'http://localhost:5001/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export const getProducts = async (token: string): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/Products`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const createProduct = async (product: Omit<Product, 'id'>, token: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/Products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id: number, product: Omit<Product, 'id'>, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ...product, id })
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
