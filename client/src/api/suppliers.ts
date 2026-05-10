const API_URL = 'http://localhost:5149/api';

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export const getSuppliers = async (token: string): Promise<Supplier[]> => {
  const response = await fetch(`${API_URL}/Suppliers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch suppliers');
  return response.json();
};

export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>, token: string): Promise<Supplier> => {
  const response = await fetch(`${API_URL}/Suppliers`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(supplier)
  });
  if (!response.ok) throw new Error('Failed to create supplier');
  return response.json();
};

export const updateSupplier = async (id: number, supplier: Supplier, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Suppliers/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(supplier)
  });
  if (!response.ok) throw new Error('Failed to update supplier');
};

export const deleteSupplier = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Suppliers/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete supplier');
};
