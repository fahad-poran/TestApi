import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts } from '../api/products';
import { InvoiceData, createInvoice } from '../api/invoices';
import { Toaster, toast } from 'react-hot-toast';

const StaffDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<{ productId: number; quantity: number; name: string; price: number }[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts(token!);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      toast.error('❌ Failed to load products');
      setLoading(false);
    }
  };

  const addToInvoice = (product: Product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === product.id);
      if (existing) {
        toast.success(`✅ Added ${product.name} to invoice`, { duration: 1500 });
        return prev.map(p => 
          p.productId === product.id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      toast.success(`✅ Added ${product.name} to invoice`, { duration: 1500 });
      return [...prev, { productId: product.id, quantity: 1, name: product.name, price: product.price }];
    });
  };

  const removeFromInvoice = (productId: number) => {
    setSelectedProducts(prev => {
      const product = prev.find(p => p.productId === productId);
      toast(`🗑️ Removed ${product?.name} from invoice`, { icon: '🗑️', duration: 1500 });
      return prev.filter(p => p.productId !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return selectedProducts.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmitInvoice = async () => {
    if (selectedProducts.length === 0) {
      toast.error('🛒 Add products to the invoice first!');
      return;
    }

    setSubmitting(true);
    try {
      const invoiceItems = selectedProducts.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      await createInvoice({
        customerName: customerName || undefined,
        invoiceItems
      }, token!);

      toast.success('✅ Invoice created successfully!', {
        duration: 3000,
        style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
      });
      
      setSelectedProducts([]);
      setCustomerName('');
    } catch (err) {
      toast.error('❌ Failed to create invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    toast('👋 Logged out!', { icon: '👋' });
    navigate('/');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            📦
          </div>
        </div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Staff Dashboard
              </h1>
              <p className="text-sm text-gray-500">Welcome back, <span className="font-semibold text-green-600">{username}</span></p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors group"
          >
            <span className="group-hover:rotate-12 transition-transform">👋</span> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-100 text-sm font-medium">Available Products</p>
                <p className="text-4xl font-bold mt-2">{products.length}</p>
              </div>
              <span className="text-5xl opacity-80">📦</span>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <span>🛍️</span>
              <p className="text-sm">Ready to sell</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Current Invoice</p>
                <p className="text-4xl font-bold mt-2">{calculateTotalItems()} items</p>
              </div>
              <span className="text-5xl opacity-80">🧾</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <span>📝</span>
              <p className="text-sm">{selectedProducts.length} unique products</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Amount</p>
                <p className="text-4xl font-bold mt-2">${calculateTotal().toFixed(2)}</p>
              </div>
              <span className="text-5xl opacity-80">💰</span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <span>💳</span>
              <p className="text-sm">Invoice total</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">🛍️</span> Select Products
              </h2>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-6xl mb-4 block">📭</span>
                  <p>No products found</p>
                </div>
              ) : filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors cursor-pointer transform hover:scale-[1.01] duration-200"
                  onClick={() => addToInvoice(product)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description || 'No description'}</p>
                    <span className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      {products.find(c => c.id === product.categoryId)?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1">
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🧾</span> Invoice Preview
              {selectedProducts.length > 0 && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                  {calculateTotalItems()} items
                </span>
              )}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>👤</span> Customer Name (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            {selectedProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4 animate-bounce">📭</div>
                <p className="text-lg font-medium">No products added yet</p>
                <p className="text-sm mt-2">Click on products to add them to the invoice</p>
              </div>
            ) : (
              <div>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {selectedProducts.map(item => (
                      <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromInvoice(item.productId)}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleSubmitInvoice}
                    disabled={submitting || selectedProducts.length === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Invoice...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        ✅ Create Invoice
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
