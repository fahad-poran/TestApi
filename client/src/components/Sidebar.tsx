import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const adminLinks = [
    { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
    { to: '/admin/products', icon: '📦', label: 'Products' },
    { to: '/admin/categories', icon: '🏷️', label: 'Categories' },
    { to: '/admin/stock', icon: '📋', label: 'Stock Management' },
    { to: '/admin/invoices', icon: '🧾', label: 'Invoices' },
    { to: '/admin/suppliers', icon: '🚚', label: 'Suppliers' },
    { to: '/change-password', icon: '🔑', label: 'Change Password' },
  ];

  const staffLinks = [
    { to: '/staff', icon: '🛒', label: 'Create Invoice', end: true },
    { to: '/staff/invoices', icon: '🧾', label: 'Invoice History' },
    { to: '/change-password', icon: '🔑', label: 'Change Password' },
  ];

  const links = role === 'Admin' ? adminLinks : staffLinks;

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-white border-r border-gray-200 shadow-xl flex flex-col transition-all duration-300 sticky top-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <span className="text-3xl">🛒</span>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  Grocery IMS
                </h1>
                <p className="text-xs text-gray-400">Inventory System</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
              {username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{username}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                role === 'Admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 mb-2">
            Navigation
          </p>
        )}
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={linkClass}
            title={collapsed ? link.label : undefined}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
            {!collapsed && <span className="font-medium text-sm">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          title={collapsed ? 'Logout' : undefined}
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
