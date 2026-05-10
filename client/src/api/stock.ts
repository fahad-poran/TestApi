export interface StockItem {
  id: number;
  productId: number;
  product?: { id: number; name: string; price: number };
  quantity: number;
  reorderLevel: number;
  lastUpdated: string;
}

export interface StockSummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  lastUpdated: string;
}

const API_URL = 'http://localhost:5149/api';

// Mock stock summary
const MOCK_STOCK_SUMMARY: StockSummary = {
  totalProducts: 24,
  lowStockCount: 3,
  outOfStockCount: 1,
  lastUpdated: new Date().toISOString()
};

export const getAllStock = async (token: string): Promise<StockItem[]> => {
  try {
    const response = await fetch(`${API_URL}/Stock`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stock');
    return response.json();
  } catch (error) {
    console.log('Using mock stock data');
    return [];
  }
};

export const updateStock = async (id: number, quantity: number, reorderLevel: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Stock/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ quantity, reorderLevel })
  });
  if (!response.ok) throw new Error('Failed to update stock');
};

export const getLowStock = async (token: string): Promise<StockItem[]> => {
  try {
    const response = await fetch(`${API_URL}/Stock/low-stock`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch low stock');
    return response.json();
  } catch (error) {
    return [];
  }
};

export const getStockSummary = async (token: string): Promise<StockSummary> => {
  try {
    const response = await fetch(`${API_URL}/Stock/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stock summary');
    return response.json();
  } catch (error) {
    console.log('Using mock stock data');
    return MOCK_STOCK_SUMMARY;
  }
};
