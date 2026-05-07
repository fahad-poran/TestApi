import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import Categories from './components/Categories';
import InvoiceHistory from './components/InvoiceHistory';
import ChangePassword from './components/ChangePassword';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={role === 'Admin' ? '/admin' : '/staff'} /> : <Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={isAuthenticated && role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/products" element={isAuthenticated && role === 'Admin' ? <Products /> : <Navigate to="/" />} />
        <Route path="/admin/categories" element={isAuthenticated && role === 'Admin' ? <Categories /> : <Navigate to="/" />} />
        <Route path="/admin/invoices" element={isAuthenticated && role === 'Admin' ? <InvoiceHistory /> : <Navigate to="/" />} />
        
        {/* Staff Routes */}
        <Route path="/staff" element={isAuthenticated ? <StaffDashboard /> : <Navigate to="/" />} />
        <Route path="/staff/products" element={isAuthenticated ? <Products /> : <Navigate to="/" />} />
        <Route path="/staff/invoices" element={isAuthenticated ? <InvoiceHistory /> : <Navigate to="/" />} />
        
        {/* Common Routes */}
        <Route path="/change-password" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
