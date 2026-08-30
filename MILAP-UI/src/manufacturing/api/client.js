const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch { /* no JSON body */ }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

const get = (path) => request(path);
const post = (path, body) => request(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
const patch = (path) => request(path, { method: 'PATCH' });
const del = (path) => request(path, { method: 'DELETE' });

export const api = {
  // Customers
  getCustomers: () => get('/customers'),
  getCustomer: (id) => get(`/customers/${id}`),
  createCustomer: (payload) => post('/customers', payload),

  // Engineers
  getEngineers: () => get('/engineers'),
  createEngineer: (payload) => post('/engineers', payload),

  // Enquiries
  getEnquiries: () => get('/enquiries'),
  createEnquiry: (customerId, payload) => post(`/enquiries?customerId=${customerId}`, payload),
  updateEnquiry: (id, payload) => put(`/enquiries/${id}`, payload),
  updateEnquiryStatus: (id, status) => patch(`/enquiries/${id}/status?status=${status}`),

  // Quotations
  getQuotations: () => get('/quotations'),
  createQuotationFromEnquiry: (enquiryId, quotation, lineItems) =>
    post(`/quotations/from-enquiry/${enquiryId}`, { quotation, lineItems }),
  approveQuotation: (id) => post(`/quotations/${id}/approve`),

  // Orders
  getOrders: () => get('/orders'),
  convertQuotationToOrder: (quotationId) => post(`/orders/from-quotation/${quotationId}`),

  // Assets
  getAssets: () => get('/assets'),
  createAsset: (customerId, orderId, payload) =>
    post(`/assets?customerId=${customerId}${orderId ? `&orderId=${orderId}` : ''}`, payload),

  // Service tickets
  getServiceTickets: () => get('/service-tickets'),
  createServiceTicket: (customerId, assetId, payload) =>
    post(`/service-tickets?customerId=${customerId}&assetId=${assetId}`, payload),
  assignEngineer: (ticketId, engineerId) => patch(`/service-tickets/${ticketId}/assign/${engineerId}`),
  startService: (ticketId) => patch(`/service-tickets/${ticketId}/start`),
  completeService: (ticketId) => patch(`/service-tickets/${ticketId}/complete`),

  // Knowledge documents
  getDocuments: () => get('/documents'),
  uploadDocument: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/documents', { method: 'POST', body: form });
  },
  deleteDocument: (id) => del(`/documents/${id}`),

  // Dashboard
  getDashboardSummary: () => get('/dashboard/summary'),

  // Ask AI
  ask: (question) => post('/ai/ask', { question }),
};
