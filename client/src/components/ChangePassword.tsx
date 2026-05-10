import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('❌ New passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5149/api/Auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      toast.success('✅ Password changed successfully!', {
        duration: 3000,
        style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(`❌ ${err.message || 'Failed to change password'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">🔑</span> Change Password
        </h1>
        <p className="text-gray-500 mt-1">User: <span className="font-semibold text-blue-600">{username}</span></p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🔐</span> Update Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🔒</span> Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none group-hover:border-gray-300"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🔒
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🆕</span> New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none group-hover:border-gray-300"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                required
                minLength={6}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🆕
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🔑</span> Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none group-hover:border-gray-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🔑
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
                Updating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🔑 Change Password
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Password Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>💡</span> Password Tips:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
          <li>Use at least 8 characters</li>
          <li>Include uppercase, lowercase, and numbers</li>
          <li>Avoid using personal information</li>
          <li>Don't reuse old passwords</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
