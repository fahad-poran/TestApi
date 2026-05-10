import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Supplier, getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/suppliers';
import { Toaster, toast } from 'react-hot-toast';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(token!);
      setSuppliers(data);
    } catch (err) {
      toast.error('❌ Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchSuppliers();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateSupplier(editingId, { ...formData, id: editingId, createdAt: '' } as Supplier, token!);
        toast.success('✅ Supplier updated!');
      } else {
        await createSupplier(formData, token!);
        toast.success('✅ Supplier created!');
      }
      setFormData({ name: '', phone: '', email: '', address: '' });
      setEditingId(null);
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      toast.error('❌ Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setFormData({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id, token!);
        toast.success('✅ Supplier deleted!');
        fetchSuppliers();
      } catch (err) {
        toast.error('❌ Delete failed');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading suppliers...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">🚚</span> Suppliers
          </h1>
          <p className="text-gray-500 mt-1">{suppliers.length} total suppliers</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', phone: '', email: '', address: '' }); }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
        >
          {showForm ? '✕ Close Form' : '➕ Add Supplier'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 animate-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {editingId ? '✏️ Edit Supplier' : '➕ New Supplier'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🏢</span>
              <input
                type="text"
                placeholder="Supplier name *"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📞</span>
              <input
                type="text"
                placeholder="Phone number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</span>
              <input
                type="text"
                placeholder="Address"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingId ? '✓ Update Supplier' : '➕ Add Supplier'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setFormData({ name: '', phone: '', email: '', address: '' }); }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search suppliers by name, phone, or email..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">No suppliers found</p>
            <p className="text-sm mt-2">Add your first supplier</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {supplier.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{supplier.name}</h3>
                    <span className="text-xs text-gray-400">ID: {supplier.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {supplier.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📞</span> {supplier.phone}
                  </p>
                )}
                {supplier.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📧</span> {supplier.email}
                  </p>
                )}
                {supplier.address && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📍</span> {supplier.address}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Suppliers;
