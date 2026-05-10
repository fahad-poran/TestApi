import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, Category } from '../api/categories';
import { getToken } from '../api/auth';
import { Toaster, toast } from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = getToken();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(token);
      setCategories(data);
    } catch (error) {
      toast.error('❌ Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    fetchCategories();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCategory.name) return;

    try {
      await createCategory(newCategory, token);
      toast.success('✅ Category created successfully!');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error('❌ Failed to create category');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">🏷️</span> Categories
        </h1>
        <p className="text-gray-500 mt-1">{categories.length} total categories</p>
      </div>
      
      {/* Add Category Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          ➕ Add New Category
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">🏷️</span>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="Category name"
              required
            />
          </div>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">📝</span>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="Description (optional)"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            ➕ Add Category
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">No categories found</p>
            <p className="text-sm mt-2">Add your first category above</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:scale-[1.02] duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏷️</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                    <span className="text-xs text-gray-400">ID: {category.id}</span>
                  </div>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{category.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
