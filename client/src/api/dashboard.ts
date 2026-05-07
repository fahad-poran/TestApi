export interface SalesData {
  date: string;
  total: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
  revenue: number;
}

export const getSalesTrend = async (days: number, token: string): Promise<SalesData[]> => {
  const response = await fetch(`http://localhost:5001/api/Dashboard/sales-trend?days=${days}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch sales trend');
  return response.json();
};

export const getTopProducts = async (count: number, token: string): Promise<TopProduct[]> => {
  const response = await fetch(`http://localhost:5001/api/Dashboard/top-products?count=${count}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch top products');
  return response.json();
};
