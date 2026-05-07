import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getProducts, Product } from '../api/products';
import { getCategories } from '../api/categories';
import { getStockSummary, StockSummary } from '../api/stock';
import { getSalesTrend, SalesData, getTopProducts, TopProduct } from '../api/dashboard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'Admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sales, top, stock] = await Promise.all([
        getSalesTrend(timeRange, token!),
        getTopProducts(5, token!),
        getStockSummary(token!)
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">Manage your grocery inventory</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold mt-2">{stockSummary?.totalProducts || 0}</p>
              </div>
              <span className="text-5xl opacity-80">📦</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <span>📈</span>
              <p className="text-sm">Active inventory</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Low Stock Items</p>
                <p className="text-4xl font-bold mt-2">{stockSummary?.lowStockCount || 0}</p>
              </div>
              <span className="text-5xl opacity-80">⚠️</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-100">
              <span>🔔</span>
              <p className="text-sm">Needs attention</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-red-100 text-sm font-medium">Out of Stock</p>
                <p className="text-4xl font-bold mt-2">{stockSummary?.outOfStockCount || 0}</p>
              </div>
              <span className="text-5xl opacity-80">📭</span>
            </div>
            <div className="flex items-center gap-2 text-red-100">
              <span>🚨</span>
              <p className="text-sm">Immediate action needed</p>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-gray-700 font-medium">📅 Time Range:</span>
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                timeRange === days 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📈</span> Sales Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px' }}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Bar dataKey="total" fill="url(#blueGradient)" name="Sales ($)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🏆</span> Top Selling Products
            </h2>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.productName}: ${entry.totalSold}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalSold"
                  >
                    {topProducts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">📊</span>
                  <p>No sales data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all transform hover:scale-[1.02] text-left"
            >
              <span className="text-4xl mb-3 block">📦</span>
              <h3 className="font-bold text-gray-800 mb-1">Manage Products</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove products</p>
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all transform hover:scale-[1.02] text-left"
            >
              <span className="text-4xl mb-3 block">🏷️</span>
              <h3 className="font-bold text-gray-800 mb-1">Categories</h3>
              <p className="text-sm text-gray-600">Organize product categories</p>
            </button>
            <button
              onClick={() => window.open('http://localhost:5001/swagger', '_blank')}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all transform hover:scale-[1.02] text-left"
            >
              <span className="text-4xl mb-3 block">📚</span>
              <h3 className="font-bold text-gray-800 mb-1">API Docs</h3>
              <p className="text-sm text-gray-600">View Swagger documentation</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
