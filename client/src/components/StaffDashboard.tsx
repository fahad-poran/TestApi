import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts } from '../api/products';
import { Invoice, createInvoice } from '../api/invoices';

const StaffDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<{ productId: number; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
      console.error('Failed to load products');
      setLoading(false);
    }
  };

  const addToInvoice = (productId: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p => 
          p.productId === productId 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromInvoice = (productId: number) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
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
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmitInvoice = async () => {
    if (selectedProducts.length === 0) {
      alert('Please add products to the invoice');
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

      alert('✅ Invoice created successfully!');
      setSelectedProducts([]);
      setCustomerName('');
    } catch (err) {
      alert('❌ Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Staff Dashboard
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {username}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
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

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Current Invoice</p>
                <p className="text-4xl font-bold mt-2">{selectedProducts.length}</p>
              </div>
              <span className="text-5xl opacity-80">🧾</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <span>📝</span>
              <p className="text-sm">Items added</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Product Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🛍️</span> Select Products
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => addToInvoice(product.id)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
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
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Customer Name (Optional)
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
                <span className="text-6xl mb-4 block">📭</span>
                <p>No products added yet</p>
                <p className="text-sm mt-2">Click on products to add them</p>
              </div>
            ) : (
              <div>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {selectedProducts.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{product?.name}</p>
                          <p className="text-sm text-gray-500">${product?.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromInvoice(item.productId)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleSubmitInvoice}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                      '✅ Create Invoice'
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
