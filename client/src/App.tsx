import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Products from './components/Products';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import Categories from './components/Categories';
import InvoiceHistory from './components/InvoiceHistory';
import ChangePassword from './components/ChangePassword';
import StockManagement from './components/StockManagement';
import Suppliers from './components/Suppliers';
import Layout from './components/Layout';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setIsAuthenticated(!!token);
      setRole(userRole);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (in case of login/logout in other tabs)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={role === 'Admin' ? '/admin' : '/staff'} /> : <Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Authenticated routes with shared Layout (Sidebar) */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/" />}>
          {/* Admin Routes */}
          <Route path="/admin" element={role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/products" element={role === 'Admin' ? <Products /> : <Navigate to="/" />} />
          <Route path="/admin/categories" element={role === 'Admin' ? <Categories /> : <Navigate to="/" />} />
          <Route path="/admin/invoices" element={role === 'Admin' ? <InvoiceHistory /> : <Navigate to="/" />} />
          <Route path="/admin/stock" element={role === 'Admin' ? <StockManagement /> : <Navigate to="/" />} />
          <Route path="/admin/suppliers" element={role === 'Admin' ? <Suppliers /> : <Navigate to="/" />} />

          {/* Staff Routes */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/products" element={<Products />} />
          <Route path="/staff/invoices" element={<InvoiceHistory />} />

          {/* Common Routes */}
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
