import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function QuoteModal() {
  const { quotations, selectedQuotationId, quoteModalOpen, setQuoteModalOpen, printQuotation } = useApp();

  const quotation = quotations.find((q) => q.id === selectedQuotationId);
  const close = () => setQuoteModalOpen(false);

  if (!quotation) return null;

  return (
    <div
      id="quoteModal"
      className={`modal${quoteModalOpen ? ' active' : ''}`}
      onClick={(e) => { if (e.target.id === 'quoteModal') close(); }}
    >
      <div className="modal-card">
        <div className="hero">
          <div>
            <h2>Customer Quotation Preview</h2>
            <div className="sub">Presentation-style quotation preview</div>
          </div>
          <div className="flex">
            <button className="btn ghost" onClick={printQuotation}>Print / Save PDF</button>
            <button className="btn secondary" onClick={close}>Close</button>
          </div>
        </div>
        <div className="quote-sheet">
          <div className="quote-head">
            <div className="quote-logo-wrap">
              <div className="milap-logo" aria-label="MILAP Manufacturing Technology AI logo">
                <svg viewBox="0 0 120 120" role="img" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="qg1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#0ea5e9" />
                      <stop offset=".55" stopColor="#2563eb" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="qg2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#22c55e" />
                      <stop offset="1" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                  <g fill="none" stroke="url(#qg1)" strokeWidth="8" strokeLinecap="round">
                    <path d="M60 8v12M60 100v12M8 60h12M100 60h12M22 22l9 9M89 89l9 9M98 22l-9 9M31 89l-9 9" />
                    <circle cx="60" cy="60" r="42" />
                  </g>
                  <path d="M23 67h18V50l11 8V44l12 9V40l15 10v17h18v15H23z" fill="#0f3b78" />
                  <rect x="28" y="58" width="5" height="17" rx="1" fill="#8bd3ff" />
                  <rect x="37" y="55" width="5" height="20" rx="1" fill="#8bd3ff" />
                  <path d="M77 34c9 3 17 10 21 19" stroke="url(#qg2)" strokeWidth="7" fill="none" strokeLinecap="round" />
                  <path d="M95 47l5 8-9 1" fill="url(#qg2)" />
                  <rect x="61" y="57" width="28" height="28" rx="6" fill="#fff" stroke="#2563eb" strokeWidth="4" />
                  <text x="75" y="76" textAnchor="middle" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="900" fill="#2563eb">AI</text>
                  <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
                    <path d="M89 62h8" />
                    <path d="M89 70h11" />
                    <path d="M89 78h8" />
                    <circle cx="101" cy="70" r="2.5" fill="#38bdf8" stroke="none" />
                  </g>
                </svg>
              </div>
              <div>
                <div className="quote-brand">MILAP</div>
                <div className="sub">Multi-Industry Linkage & Automation Platform</div>
                <div className="logo-meaning"><span>Manufacturing</span><span>Technology</span><span>AI</span></div>
              </div>
            </div>
            <div className="quote-meta">Quotation: {quotation.code}<br />Date: {quotation.createdAt?.slice(0, 10)}<br />Valid: 30 days</div>
          </div>
          <h3>To: {quotation.customer?.name}</h3>
          <p className="sub">{quotation.customer?.address}</p>
          <table className="quote-table">
            <thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
            <tbody>
              {quotation.lineItems?.map((li) => (
                <tr key={li.id}><td>{li.itemName}</td><td>{li.quantity}</td><td>{li.amount}</td></tr>
              ))}
              <tr><td colSpan="2" className="quote-total">Total</td><td className="quote-total">{quotation.totalAmount}</td></tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: 18 }}>Commercial Terms</h3>
          <p>Payment: {quotation.paymentTerms}<br />Delivery: {quotation.deliveryEstimate}<br />Warranty: {quotation.warrantyMonths} months from installation</p>
        </div>
      </div>
    </div>
  );
}
