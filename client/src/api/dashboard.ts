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

// Mock data for sales trend
const generateMockSalesData = (days: number): SalesData[] => {
  const data: SalesData[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      total: Math.floor(Math.random() * 1000) + 500
    });
  }
  return data;
};

// Mock data for top products
const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { productId: 1, productName: 'Organic Apples', totalSold: 145, revenue: 434.55 },
  { productId: 2, productName: 'Whole Grain Bread', totalSold: 120, revenue: 418.80 },
  { productId: 3, productName: 'Free Range Eggs', totalSold: 98, revenue: 489.02 },
  { productId: 4, productName: 'Almond Milk', totalSold: 87, revenue: 347.13 },
  { productId: 5, productName: 'Greek Yogurt', totalSold: 76, revenue: 417.24 }
];

export const getSalesTrend = async (days: number, token: string): Promise<SalesData[]> => {
  try {
    const response = await fetch(`http://localhost:5149/api/Dashboard/sales-trend?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch sales trend');
    return response.json();
  } catch (error) {
    console.log('Using mock sales data');
    return generateMockSalesData(days);
  }
};

export const getTopProducts = async (count: number, token: string): Promise<TopProduct[]> => {
  try {
    const response = await fetch(`http://localhost:5149/api/Dashboard/top-products?count=${count}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch top products');
    return response.json();
  } catch (error) {
    console.log('Using mock top products data');
    return MOCK_TOP_PRODUCTS.slice(0, count);
  }
};
