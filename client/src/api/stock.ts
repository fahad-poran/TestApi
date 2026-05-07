export interface StockSummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  lastUpdated: string;
}

export const getStockSummary = async (token: string): Promise<StockSummary> => {
  const response = await fetch('http://localhost:5001/api/Stock/summary', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch stock summary');
  return response.json();
};
