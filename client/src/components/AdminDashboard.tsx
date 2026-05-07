import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { getProducts, Product } from '../api/products';
import { getCategories } from '../api/categories';
import { getStockSummary, StockSummary } from '../api/stock';
import { getSalesTrend, SalesData, getTopProducts, TopProduct } from '../api/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'Admin') {
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        const [sales, top, stock] = await Promise.all([
          getSalesTrend(7),
          getTopProducts(5),
          getStockSummary()
        ]);
        setSalesData(sales);
        setTopProducts(top);
        setStockSummary(stock);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold">{stockSummary?.totalProducts || 0}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-700">{stockSummary?.lowStockCount || 0}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-700">{stockSummary?.outOfStockCount || 0}</p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Sales Trend (Last 7 Days)</h2>
        <BarChart width={800} height={300} data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3B82F6" name="Sales ($)" />
        </BarChart>
      </div>

      {/* Top Products Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
        <PieChart width={800} height={400}>
          <Pie
            data={topProducts}
            cx={400}
            cy={200}
            labelLine={false}
            label={(entry) => `${entry.productName}: ${entry.totalSold}`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="totalSold"
          >
            {topProducts.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default AdminDashboard;
