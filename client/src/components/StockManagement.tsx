import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockItem, getAllStock, updateStock } from '../api/stock';
import { Toaster, toast } from 'react-hot-toast';

const StockManagement = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editReorderLevel, setEditReorderLevel] = useState(10);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  const fetchStock = async () => {
    try {
      setLoading(true);
      const data = await getAllStock(token!);
      setStocks(data);
    } catch (err) {
      toast.error('❌ Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchStock();
  }, [token, navigate]);

  const handleEdit = (stock: StockItem) => {
    setEditingId(stock.id);
    setEditQuantity(stock.quantity);
    setEditReorderLevel(stock.reorderLevel);
  };

  const handleSave = async (id: number) => {
    try {
      await updateStock(id, editQuantity, editReorderLevel, token!);
      toast.success('✅ Stock updated successfully!');
      setEditingId(null);
      fetchStock();
    } catch (err) {
      toast.error('❌ Failed to update stock');
    }
  };

  const getStockStatus = (stock: StockItem) => {
    if (stock.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', icon: '🔴' };
    if (stock.quantity <= stock.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', icon: '🟢' };
  };

  const filteredStocks = stocks
    .filter(s => {
      if (filter === 'low') return s.quantity <= s.reorderLevel && s.quantity > 0;
      if (filter === 'out') return s.quantity === 0;
      return true;
    })
    .filter(s => 
      s.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalItems = stocks.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockCount = stocks.filter(s => s.quantity <= s.reorderLevel && s.quantity > 0).length;
  const outOfStockCount = stocks.filter(s => s.quantity === 0).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading stock data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">📋</span> Stock Management
        </h1>
        <p className="text-gray-500 mt-1">Monitor and manage inventory levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stocks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 cursor-pointer hover:bg-yellow-50 transition-colors" onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 cursor-pointer hover:bg-red-50 transition-colors" onClick={() => setFilter(filter === 'out' ? 'all' : 'out')}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f === 'all' ? '📦 All' : f === 'low' ? '⚠️ Low' : '🚨 Out'}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left font-bold">📦 Product</th>
                <th className="px-6 py-4 text-left font-bold">💰 Price</th>
                <th className="px-6 py-4 text-left font-bold">📊 Quantity</th>
                <th className="px-6 py-4 text-left font-bold">🔔 Reorder Level</th>
                <th className="px-6 py-4 text-left font-bold">🚦 Status</th>
                <th className="px-6 py-4 text-left font-bold">📅 Last Updated</th>
                <th className="px-6 py-4 text-center font-bold">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-xl">No stock records found</p>
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock, index) => {
                  const status = getStockStatus(stock);
                  const isEditing = editingId === stock.id;
                  return (
                    <tr key={stock.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{stock.product?.name || `Product #${stock.productId}`}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                          ${stock.product?.price?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(+e.target.value)}
                            className="w-20 px-2 py-1 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                            min="0"
                          />
                        ) : (
                          <span className="font-bold text-gray-800">{stock.quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editReorderLevel}
                            onChange={(e) => setEditReorderLevel(+e.target.value)}
                            className="w-20 px-2 py-1 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                            min="0"
                          />
                        ) : (
                          <span className="text-gray-600">{stock.reorderLevel}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(stock.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(stock.id)}
                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                              >
                                ✅ Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(stock)}
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredStocks.length}</span> of <span className="font-bold text-gray-800">{stocks.length}</span> stock records
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
