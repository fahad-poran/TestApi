import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceData, getInvoices, downloadInvoicePdf } from '../api/invoices';
import { Toaster, toast } from 'react-hot-toast';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await getInvoices(token);
        setInvoices(data);
      } catch (err) {
        toast.error('❌ Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token, navigate]);

  const handleDownloadPdf = (id: number) => {
    try {
      downloadInvoicePdf(id, token!);
      toast.success('✅ PDF download started!', { duration: 2000 });
    } catch (err) {
      toast.error('❌ PDF download failed');
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading invoices...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">🧾</span> Invoice History
        </h1>
        <p className="text-gray-500 mt-1">{invoices.length} total invoices • ${totalRevenue.toFixed(2)} revenue</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            className="w-full pl-14 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left font-bold">#ID</th>
                <th className="px-6 py-4 text-left font-bold">🧾 Invoice #</th>
                <th className="px-6 py-4 text-left font-bold">👤 Customer</th>
                <th className="px-6 py-4 text-left font-bold">💰 Amount</th>
                <th className="px-6 py-4 text-left font-bold">📅 Date</th>
                <th className="px-6 py-4 text-center font-bold">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-xl">No invoices found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 mt-2"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-mono text-gray-600">{invoice.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {invoice.customerName || <span className="text-gray-400">Walk-in Customer</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                        ${invoice.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDownloadPdf(invoice.id)}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <span>📄</span> PDF
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
            Showing <span className="font-bold text-gray-800">{filteredInvoices.length}</span> of <span className="font-bold text-gray-800">{invoices.length}</span> invoices
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Revenue:</p>
            <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistory;