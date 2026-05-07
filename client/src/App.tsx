import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import AdminDashboard from './components/AdminDashboard';

// Staff Dashboard (simplified)
const StaffDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Staff Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">My Invoices</h3>
          <p className="text-3xl font-bold">View Below</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Create New Invoice</h3>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            New Invoice
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
        {/* Invoice list would go here */}
      </div>
    </div>
  );
};

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
        
        {/* Staff Routes */}
        <Route path="/staff" element={isAuthenticated && role !== 'Admin' ? <StaffDashboard /> : <Navigate to="/" />} />
        <Route path="/staff/products" element={isAuthenticated ? <Products /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
