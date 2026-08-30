import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const emptyConfig = { product: '', quantity: '', basePrice: '', deliveryEstimate: '', paymentTerms: '30/60/10', warrantyMonths: '12' };
const emptyLineItem = { itemName: '', quantity: '1', amount: '' };

export default function Quotation() {
  const {
    enquiries, quotations, customers,
    selectedEnquiryId, setSelectedEnquiryId,
    selectedQuotationId, setSelectedQuotationId,
    buildQuotation, approveQuotation, convertToOrder,
    setQuoteModalOpen, showToast,
  } = useApp();

  const [config, setConfig] = useState(emptyConfig);
  const [lineItems, setLineItems] = useState([]);
  const [newItem, setNewItem] = useState(emptyLineItem);

  const buildableEnquiries = enquiries.filter((e) => e.status !== 'CLOSED');
  const selectedEnquiry = enquiries.find((e) => e.id === Number(selectedEnquiryId));
  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId)
    || (selectedEnquiryId && quotations.filter((q) => q.enquiry?.id === Number(selectedEnquiryId)).slice(-1)[0]);

  // QuoteModal reads selectedQuotationId straight from context, so keep it in
  // sync whenever this screen resolves a quotation via the enquiry fallback.
  useEffect(() => {
    if (selectedQuotation && selectedQuotation.id !== selectedQuotationId) {
      setSelectedQuotationId(selectedQuotation.id);
    }
  }, [selectedQuotation, selectedQuotationId, setSelectedQuotationId]);

  const lineTotal = useMemo(
    () => lineItems.reduce((sum, li) => sum + (Number(li.amount) || 0), 0),
    [lineItems]
  );

  const setConfigField = (field, value) => setConfig((c) => ({ ...c, [field]: value }));

  const pickEnquiry = (id) => {
    setSelectedEnquiryId(id ? Number(id) : null);
    setSelectedQuotationId(null);
    const enq = enquiries.find((e) => e.id === Number(id));
    setConfig({
      product: enq?.product || '',
      quantity: enq?.quantity || '',
      basePrice: '',
      deliveryEstimate: enq?.requiredDelivery || '',
      paymentTerms: '30/60/10',
      warrantyMonths: '12',
    });
    setLineItems([]);
  };

  const addLineItem = () => {
    if (!newItem.itemName.trim() || !newItem.amount) return;
    setLineItems((items) => [...items, { ...newItem }]);
    setNewItem(emptyLineItem);
  };

  const removeLineItem = (idx) => setLineItems((items) => items.filter((_, i) => i !== idx));

  const submitQuotation = async () => {
    if (!selectedEnquiryId) {
      showToast('Select an enquiry to build a quotation from.');
      return;
    }
    if (lineItems.length === 0) {
      showToast('Add at least one line item.');
      return;
    }
    await buildQuotation(
      Number(selectedEnquiryId),
      {
        product: config.product || null,
        quantity: config.quantity ? Number(config.quantity) : null,
        basePrice: config.basePrice ? Number(config.basePrice) : null,
        deliveryEstimate: config.deliveryEstimate || null,
        paymentTerms: config.paymentTerms || null,
        warrantyMonths: config.warrantyMonths ? Number(config.warrantyMonths) : null,
      },
      lineItems.map((li) => ({ itemName: li.itemName, quantity: Number(li.quantity) || 1, amount: Number(li.amount) })),
    );
    setLineItems([]);
  };

  return (
    <section id="quotation" className="screen active">
      <div className="hero">
        <div><h1>Quotation Builder</h1><div className="sub">Build a compliant draft from approved products, pricing and commercial terms.</div></div>
        {selectedQuotation && <button className="btn secondary" onClick={() => setQuoteModalOpen(true)}>Preview Customer PDF</button>}
      </div>
      <div className="stepper">
        <span className="step">Enquiry</span>
        <span className={`step${!selectedQuotation ? ' current' : ''}`}>Quotation</span>
        <span className={`step${selectedQuotation?.status === 'APPROVED' ? ' current' : ''}`}>Approval</span>
        <span className={`step${selectedQuotation?.status === 'CONVERTED' ? ' current' : ''}`}>Order</span>
      </div>

      <div className="card">
        <h2>Source Enquiry</h2>
        <div className="formgrid">
          <div className="full">
            <label>Enquiry</label>
            <select value={selectedEnquiryId || ''} onChange={(e) => pickEnquiry(e.target.value)}>
              <option value="">Select enquiry</option>
              {buildableEnquiries.map((e) => (
                <option key={e.id} value={e.id}>{e.code} — {e.customer?.name} — {e.product || 'Untitled requirement'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedEnquiry && !selectedQuotation && (
        <div className="grid two" style={{ marginTop: 14 }}>
          <div className="card">
            <h2>Configuration</h2>
            <div className="formgrid">
              <div className="full"><label>Customer</label><div className="input" style={{ background: 'transparent' }}>{selectedEnquiry.customer?.name}</div></div>
              <div><label>Base Product / Solution</label><input className="input" value={config.product} onChange={(e) => setConfigField('product', e.target.value)} /></div>
              <div><label>Quantity</label><input type="number" className="input" value={config.quantity} onChange={(e) => setConfigField('quantity', e.target.value)} /></div>
              <div><label>Base Price</label><input type="number" className="input" value={config.basePrice} onChange={(e) => setConfigField('basePrice', e.target.value)} /></div>
              <div><label>Delivery</label><input className="input" value={config.deliveryEstimate} onChange={(e) => setConfigField('deliveryEstimate', e.target.value)} /></div>
              <div><label>Payment Terms</label><input className="input" value={config.paymentTerms} onChange={(e) => setConfigField('paymentTerms', e.target.value)} /></div>
              <div><label>Warranty (months)</label><input type="number" className="input" value={config.warrantyMonths} onChange={(e) => setConfigField('warrantyMonths', e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <h2>Line Items</h2>
            <div className="tablewrap">
              <table>
                <thead><tr><th>Item</th><th>Qty</th><th>Amount</th><th></th></tr></thead>
                <tbody>
                  {lineItems.map((li, idx) => (
                    <tr key={idx}>
                      <td>{li.itemName}</td><td>{li.quantity}</td><td>{li.amount}</td>
                      <td><button type="button" className="icon-btn" onClick={() => removeLineItem(idx)}>✕</button></td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && <tr><td colSpan="4" className="sub">No line items yet.</td></tr>}
                  <tr><td><b>Total</b></td><td></td><td><b>{lineTotal}</b></td><td></td></tr>
                </tbody>
              </table>
            </div>
            <div className="formgrid" style={{ marginTop: 10 }}>
              <div><label>Item</label><input className="input" value={newItem.itemName} onChange={(e) => setNewItem((n) => ({ ...n, itemName: e.target.value }))} /></div>
              <div><label>Qty</label><input type="number" className="input" value={newItem.quantity} onChange={(e) => setNewItem((n) => ({ ...n, quantity: e.target.value }))} /></div>
              <div><label>Amount</label><input type="number" className="input" value={newItem.amount} onChange={(e) => setNewItem((n) => ({ ...n, amount: e.target.value }))} /></div>
            </div>
            <button type="button" className="btn secondary small" style={{ marginTop: 8 }} onClick={addLineItem}>+ Add Line Item</button>
            <button type="button" className="btn" style={{ marginTop: 12, marginLeft: 8 }} onClick={submitQuotation}>Save Quotation</button>
          </div>
        </div>
      )}

      {selectedQuotation && (
        <div className="card" style={{ marginTop: 14 }}>
          <h2>Quotation Preview — {selectedQuotation.code}</h2>
          <div className="tablewrap">
            <table>
              <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
              <tbody>
                {selectedQuotation.lineItems?.map((li) => (
                  <tr key={li.id}><td>{li.itemName}</td><td>{li.quantity}</td><td>{li.amount}</td></tr>
                ))}
                <tr><td><b>Total</b></td><td></td><td><b>{selectedQuotation.totalAmount}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="callout" style={{ marginTop: 12 }}>
            Terms: {selectedQuotation.paymentTerms} • Delivery: {selectedQuotation.deliveryEstimate} • Warranty: {selectedQuotation.warrantyMonths} months • Status: {selectedQuotation.status}
          </div>
          <div className="flex" style={{ marginTop: 12 }}>
            {selectedQuotation.status === 'DRAFT' && (
              <button className="btn secondary" onClick={() => approveQuotation(selectedQuotation.id)}>Approve</button>
            )}
            <button className="btn ghost" onClick={() => setQuoteModalOpen(true)}>Preview PDF</button>
            {selectedQuotation.status === 'APPROVED' && (
              <button className="btn" onClick={() => convertToOrder(selectedQuotation.id)}>Convert to Order</button>
            )}
            {selectedQuotation.status === 'CONVERTED' && (
              <button className="btn" onClick={() => window.scrollTo(0, 0)} disabled>Already converted to an order</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
