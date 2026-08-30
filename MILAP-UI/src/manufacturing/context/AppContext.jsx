import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { api } from '../api/client.js';

const AppContext = createContext(null);

function formatBytes(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function AppProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [screen, setScreen] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef(null);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Live data, loaded from the API.
  const [customers, setCustomers] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState({});

  // Cross-screen selection state (e.g. "build quotation" carries the enquiry over).
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Ask me about quotations, delayed orders, service tickets or connected knowledge documents.' },
  ]);

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }, []);

  const go = useCallback((id) => {
    setScreen(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reloadAll = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [
        customersRes, engineersRes, enquiriesRes, quotationsRes,
        ordersRes, assetsRes, ticketsRes, documentsRes, summaryRes,
      ] = await Promise.all([
        api.getCustomers(), api.getEngineers(), api.getEnquiries(), api.getQuotations(),
        api.getOrders(), api.getAssets(), api.getServiceTickets(), api.getDocuments(), api.getDashboardSummary(),
      ]);
      setCustomers(customersRes);
      setEngineers(engineersRes);
      setEnquiries(enquiriesRes);
      setQuotations(quotationsRes);
      setOrders(ordersRes);
      setAssets(assetsRes);
      setServiceTickets(ticketsRes);
      setDocuments(documentsRes);
      setDashboardSummary(summaryRes);
    } catch (err) {
      setLoadError(err.message || 'Could not reach the MILAP API. Is it running on localhost:8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email) => {
    setUserEmail(email);
    setLoggedIn(true);
    setScreen('dashboard');
    reloadAll();
  }, [reloadAll]);

  const logout = useCallback(() => {
    setLoggedIn(false);
  }, []);

  // ---- Customers ----
  const createCustomer = useCallback(async (payload) => {
    try {
      await api.createCustomer(payload);
      showToast(`"${payload.name}" added.`);
      await reloadAll();
    } catch (err) {
      showToast(`Could not create customer: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  // ---- Enquiries ----
  const createEnquiry = useCallback(async (customerId, payload) => {
    try {
      const created = await api.createEnquiry(customerId, payload);
      showToast(`Enquiry ${created.code} captured.`);
      await reloadAll();
      return created;
    } catch (err) {
      showToast(`Could not create enquiry: ${err.message}`);
      return null;
    }
  }, [reloadAll, showToast]);

  const openEnquiryForQuotation = useCallback((enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setSelectedQuotationId(null);
    go('quotation');
  }, [go]);

  // ---- Quotations ----
  const buildQuotation = useCallback(async (enquiryId, quotationPayload, lineItems) => {
    try {
      const created = await api.createQuotationFromEnquiry(enquiryId, quotationPayload, lineItems);
      showToast(`Quotation ${created.code} created.`);
      setSelectedQuotationId(created.id);
      await reloadAll();
      return created;
    } catch (err) {
      showToast(`Could not create quotation: ${err.message}`);
      return null;
    }
  }, [reloadAll, showToast]);

  const approveQuotation = useCallback(async (quotationId) => {
    try {
      await api.approveQuotation(quotationId);
      showToast('Quotation approved.');
      await reloadAll();
    } catch (err) {
      showToast(`Could not approve quotation: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  const convertToOrder = useCallback(async (quotationId) => {
    try {
      const order = await api.convertQuotationToOrder(quotationId);
      showToast(`Order ${order.code} created.`);
      setSelectedOrderId(order.id);
      await reloadAll();
      go('orders');
      return order;
    } catch (err) {
      showToast(`Could not convert to order: ${err.message}`);
      return null;
    }
  }, [reloadAll, showToast, go]);

  // ---- Assets ----
  const createAsset = useCallback(async (customerId, orderId, payload) => {
    try {
      await api.createAsset(customerId, orderId, payload);
      showToast(`Asset "${payload.name}" registered.`);
      await reloadAll();
    } catch (err) {
      showToast(`Could not create asset: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  // ---- Service ----
  const createServiceTicket = useCallback(async (customerId, assetId, payload) => {
    try {
      const created = await api.createServiceTicket(customerId, assetId, payload);
      showToast(`Service ticket ${created.code} created.`);
      setSelectedTicketId(created.id);
      await reloadAll();
      return created;
    } catch (err) {
      showToast(`Could not create service ticket: ${err.message}`);
      return null;
    }
  }, [reloadAll, showToast]);

  const assignEngineer = useCallback(async (ticketId, engineerId) => {
    try {
      await api.assignEngineer(ticketId, engineerId);
      showToast('Engineer assigned.');
      await reloadAll();
    } catch (err) {
      showToast(`Could not assign engineer: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  const startService = useCallback(async (ticketId) => {
    try {
      await api.startService(ticketId);
      showToast('Service timer started.');
      await reloadAll();
    } catch (err) {
      showToast(`Could not start service: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  const completeService = useCallback(async (ticketId) => {
    try {
      await api.completeService(ticketId);
      showToast('Service ticket completed.');
      await reloadAll();
    } catch (err) {
      showToast(`Could not complete service: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  // ---- Knowledge documents ----
  const uploadDocuments = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    try {
      for (const file of files) {
        await api.uploadDocument(file);
      }
      showToast(files.length === 1 ? `"${files[0].name}" uploaded and ready to query.` : `${files.length} documents uploaded and ready to query.`);
      await reloadAll();
    } catch (err) {
      showToast(`Upload failed: ${err.message}`);
    }
  }, [reloadAll, showToast]);

  const deleteDocument = useCallback(async (id) => {
    const target = documents.find((doc) => doc.id === id);
    try {
      await api.deleteDocument(id);
      if (target) showToast(`"${target.name}" removed.`);
      await reloadAll();
    } catch (err) {
      showToast(`Could not remove document: ${err.message}`);
    }
  }, [documents, reloadAll, showToast]);

  // ---- Ask AI ----
  const askAI = useCallback(async (question) => {
    const q = question.trim();
    if (!q) return;
    setChatMessages((msgs) => [...msgs, { role: 'user', text: q }]);
    try {
      const { answer } = await api.ask(q);
      setChatMessages((msgs) => [...msgs, { role: 'bot', text: answer }]);
    } catch (err) {
      setChatMessages((msgs) => [...msgs, { role: 'bot', text: `Could not reach the AI assistant: ${err.message}` }]);
    }
  }, []);

  const printQuotation = useCallback(() => {
    const sheet = document.querySelector('.quote-sheet');
    if (!sheet) return;
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>MILAP Quotation</title><style>body{font-family:Arial;padding:30px;color:#172033}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}.quote-head{display:flex;justify-content:space-between;border-bottom:2px solid #222;padding-bottom:12px}.quote-brand{font-size:22px;font-weight:bold}.quote-logo-wrap{display:flex;align-items:center;gap:10px}.quote-ref-logo{width:64px;height:50px;overflow:hidden;border-radius:8px}.quote-ref-logo img{width:100%;height:100%;object-fit:cover}.sub,.quote-meta,.footer-note{color:#667085;font-size:12px}.quote-total{font-size:18px;font-weight:bold}</style></head><body>' + sheet.innerHTML + '</body></html>');
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  }, []);

  const value = {
    loggedIn, userEmail, screen, go, loading, loadError,
    toast, showToast,
    login, logout, reloadAll,
    quoteModalOpen, setQuoteModalOpen,

    customers, engineers, enquiries, quotations, orders, assets, serviceTickets, documents, dashboardSummary,

    selectedEnquiryId, setSelectedEnquiryId,
    selectedQuotationId, setSelectedQuotationId,
    selectedOrderId, setSelectedOrderId,
    selectedAssetId, setSelectedAssetId,
    selectedTicketId, setSelectedTicketId,

    createCustomer,
    createEnquiry, openEnquiryForQuotation,
    buildQuotation, approveQuotation, convertToOrder,
    createAsset,
    createServiceTicket, assignEngineer, startService, completeService,
    uploadDocuments, deleteDocument,
    askAI, chatMessages,
    printQuotation,
    formatBytes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
