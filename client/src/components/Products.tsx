import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getCategories } from '../api/categories';
import { Category } from '../api/categories';
import { Toaster, toast } from 'react-hot-toast';

// Skeleton Loader Component
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
    <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
  </tr>
);

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', categoryId: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(token!),
        getCategories(token!)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      toast.error('❌ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, newProduct, token!);
        toast.success('✅ Product updated successfully!');
      } else {
        await createProduct(newProduct, token!);
        toast.success('✅ Product created successfully!');
      }
      setNewProduct({ name: '', price: 0, description: '', categoryId: 0 });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error('❌ Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({ 
      name: product.name, 
      price: product.price, 
      description: product.description || '',
      categoryId: product.categoryId || 0
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('✏️ Editing product...', { icon: '✏️' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('🗑️ Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, token!);
        toast.success('✅ Product deleted!', { style: { background: '#10B981' } });
        loadData();
      } catch (err) {
        toast.error('❌ Delete failed');
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Loading products...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Products Management
              </h1>
              <p className="text-sm text-gray-500">{products.length} total products</p>
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
        {/* Add/Edit Product Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
            {editingId && (
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Editing ID: {editingId}</span>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">📦</span>
              <input
                type="text"
                placeholder="Product name"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">💰</span>
              <input
                type="number"
                placeholder="Price"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({...newProduct, price: +e.target.value})}
                required
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white cursor-pointer hover:bg-gray-50"
              value={newProduct.categoryId || ''}
              onChange={(e) => setNewProduct({...newProduct, categoryId: +e.target.value})}
            >
              <option value="">📂 Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>📂 {cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {editingId ? '✓ Update' : '➕ Add'}
                  </span>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { 
                    setEditingId(null); 
                    setNewProduct({ name: '', price: 0, description: '', categoryId: 0 });
                    toast('❌ Cancelled editing', { icon: '❌' });
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl group-focus-within:text-blue-500 transition-colors">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or description..."
              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">#ID</th>
                  <th className="px-6 py-4 text-left font-bold">📦 Name</th>
                  <th className="px-6 py-4 text-left font-bold">💰 Price</th>
                  <th className="px-6 py-4 text-left font-bold">📂 Category</th>
                  <th className="px-6 py-4 text-left font-bold">📝 Description</th>
                  <th className="px-6 py-4 text-center font-bold">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">📭</div>
                        <p className="text-xl text-gray-500 mb-2">No products found</p>
                        <p className="text-gray-400">
                          {searchTerm ? 'Try a different search term' : 'Add your first product to get started!'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors cursor-pointer`}
                      onClick={() => handleEdit(product)}
                    >
                      <td className="px-6 py-4 font-mono text-gray-600">{product.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          📂 {categories.find(c => c.id === product.categoryId)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{product.description || '-'}</td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-1 group"
                          >
                            <span className="group-hover:rotate-12 transition-transform">✏️</span> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-1 group"
                          >
                            <span className="group-hover:scale-110 transition-transform">🗑️</span> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> of <span className="font-bold text-gray-800">{products.length}</span> products
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
