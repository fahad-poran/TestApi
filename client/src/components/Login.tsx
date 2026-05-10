import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, LoginRequest } from '../api/auth';
import { Toaster, toast } from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: 'admin',
    password: 'Hello@123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('username', response.username);
      
      // Dispatch storage event to trigger App component re-render
      window.dispatchEvent(new Event('storage'));
      
      toast.success('🎉 Login successful! Redirecting...', {
        duration: 2000,
        style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
      });
      
      // Navigate to root path to trigger App component re-render with new auth state
      console.log('Login successful, navigating to root path');
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      toast.error('❌ Login failed. Please check credentials.', {
        duration: 3000,
        style: { background: '#EF4444', color: '#fff', fontWeight: 'bold' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>

      <Toaster position="top-center" />
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm mb-4 transform hover:scale-110 transition-transform duration-300">
            <span className="text-6xl">🛒</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Grocery Inventory
          </h1>
          <p className="text-blue-100 text-lg">Production Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-3xl hover:scale-[1.01] duration-300 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">👋</span> Welcome Back
          </h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3 animate-slide-in">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>👤</span> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none group-hover:border-gray-300"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="Enter username"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  👤
                </span>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🔒</span> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none group-hover:border-gray-300"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  🔒
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In →
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🎭</span> Demo Credentials:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                   onClick={() => { setCredentials({ username: 'admin', password: 'Hello@123' }); toast.success('✅ Admin credentials filled!'); }}>
                <span className="text-gray-600 flex items-center gap-2">
                  <span className="text-lg">👑</span> Admin:
                </span>
                <code className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">admin / Hello@123</code>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                   onClick={() => { setCredentials({ username: 'user', password: 'User@123' }); toast.success('✅ Staff credentials filled!'); }}>
                <span className="text-gray-600 flex items-center gap-2">
                  <span className="text-lg">👤</span> Staff:
                </span>
                <code className="text-green-600 font-mono bg-green-50 px-2 py-1 rounded">user / User@123</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200 text-sm mt-6 flex items-center justify-center gap-2">
          <span>© 2026 Grocery Inventory System</span>
          <span className="text-blue-300">•</span>
          <span className="text-blue-100">Built with ❤️</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
