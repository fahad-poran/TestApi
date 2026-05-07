export interface InvoiceData {
  id: number;
  invoiceNumber: string;
  userId: number;
  customerName?: string;
  customerPhone?: string;
  totalAmount: number;
  createdAt: string;
  invoiceItems: InvoiceItemData[];
}

export interface InvoiceItemData {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: { id: number; name: string; price: number };
}

export const createInvoice = async (
  invoice: { customerName?: string; invoiceItems: { productId: number; quantity: number }[] },
  token: string
): Promise<InvoiceData> => {
  const response = await fetch('http://localhost:5001/api/Invoices', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(invoice)
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
};

export const getInvoices = async (token: string): Promise<InvoiceData[]> => {
  const response = await fetch('http://localhost:5001/api/Invoices', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
};

export const getInvoice = async (id: number, token: string): Promise<InvoiceData> => {
  const response = await fetch(`http://localhost:5001/api/Invoices/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch invoice');
  return response.json();
};

export const downloadInvoicePdf = (id: number, token: string) => {
  window.open(`http://localhost:5001/api/Invoices/pdf/${id}?token=${token}`, '_blank');
};
