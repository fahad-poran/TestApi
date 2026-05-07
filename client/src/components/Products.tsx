import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

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
    } catch (err) {
      console.error('Failed to load products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, newProduct, token!);
      } else {
        await createProduct(newProduct, token!);
      }
      setNewProduct({ name: '', price: 0, description: '' });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      console.error('Operation failed');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({ name: product.name, price: product.price, description: product.description || '' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteProduct(id, token!);
        loadProducts();
      } catch (err) {
        console.error('Delete failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border rounded"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="p-2 border rounded"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: +e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setNewProduct({ name: '', price: 0, description: '' }); }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="p-2">{product.id}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">${product.price}</td>
              <td className="p-2">{product.description}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(product)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
