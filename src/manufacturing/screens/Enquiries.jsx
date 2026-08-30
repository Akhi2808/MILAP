import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const SOURCES = ['EMAIL_PDF', 'WHATSAPP', 'WEBSITE'];

const emptyForm = {
  customerId: '', source: 'EMAIL_PDF', requirementText: '',
  product: '', material: '', quantity: '', keyParam1: '', keyParam2: '', requiredDelivery: '',
};

export default function Enquiries() {
  const { customers, enquiries, createEnquiry, openEnquiryForQuotation, showToast } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [openId, setOpenId] = useState(null);
  const newEnquiryRef = useRef(null);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const scrollToNewEnquiry = () => newEnquiryRef.current?.scrollIntoView({ behavior: 'smooth' });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.requirementText.trim()) {
      showToast('Select a customer and enter the RFQ text.');
      return;
    }
    const created = await createEnquiry(Number(form.customerId), {
      requirementText: form.requirementText,
      product: form.product || null,
      material: form.material || null,
      quantity: form.quantity ? Number(form.quantity) : null,
      keyParam1: form.keyParam1 || null,
      keyParam2: form.keyParam2 || null,
      requiredDelivery: form.requiredDelivery || null,
      source: form.source,
    });
    if (created) {
      setForm(emptyForm);
      setOpenId(created.id);
    }
  };

  const openEnquiry = enquiries.find((e) => e.id === openId);

  return (
    <section id="enquiries" className="screen active">
      <div className="hero">
        <div><h1>Enquiry & RFQ Management</h1><div className="sub">Capture customer requirements from email, PDF, WhatsApp or website.</div></div>
        <button className="btn" onClick={scrollToNewEnquiry}>+ Capture Enquiry</button>
      </div>

      <div className="card tablewrap">
        <table>
          <thead><tr><th>Enquiry</th><th>Customer</th><th>Requirement</th><th>Source</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {enquiries.length === 0 && <tr><td colSpan="6" className="sub">No enquiries yet. Capture one below.</td></tr>}
            {enquiries.map((enq) => (
              <tr key={enq.id}>
                <td>{enq.code}</td>
                <td>{enq.customer?.name}</td>
                <td>{enq.product || enq.requirementText?.slice(0, 60)}</td>
                <td>{enq.source}</td>
                <td><span className={`pill${enq.status === 'NEW' ? '' : ' warn'}`}>{enq.status}</span></td>
                <td><button className="btn small" onClick={() => setOpenId(enq.id)}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openEnquiry && (
        <div className="card ai" style={{ marginTop: 14 }}>
          <div className="aihead">Enquiry {openEnquiry.code}</div>
          <div className="grid three" style={{ marginTop: 12 }}>
            <div><label>Product / System</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.product || '—'}</div></div>
            <div><label>Material / Application</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.material || '—'}</div></div>
            <div><label>Quantity</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.quantity ?? '—'}</div></div>
            <div><label>Key Parameter 1</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.keyParam1 || '—'}</div></div>
            <div><label>Key Parameter 2</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.keyParam2 || '—'}</div></div>
            <div><label>Required Delivery</label><div className="input" style={{ background: 'transparent' }}>{openEnquiry.requiredDelivery || '—'}</div></div>
          </div>
          <div className="flex" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => openEnquiryForQuotation(openEnquiry.id)}>Build Quotation</button>
          </div>
        </div>
      )}

      <div id="newEnquiry" ref={newEnquiryRef} className="card" style={{ marginTop: 14 }}>
        <h2>Capture New Enquiry</h2>
        <form onSubmit={submit}>
          <div className="formgrid">
            <div>
              <label>Customer</label>
              <select value={form.customerId} onChange={(e) => setField('customerId', e.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label>Source</label>
              <select value={form.source} onChange={(e) => setField('source', e.target.value)}>
                {SOURCES.map((s) => <option key={s} value={s}>{s.replace('_', ' + ')}</option>)}
              </select>
            </div>
            <div className="full">
              <label>Customer Message / RFQ</label>
              <textarea rows="4" value={form.requirementText} onChange={(e) => setField('requirementText', e.target.value)} required />
            </div>
            <div><label>Product / System</label><input className="input" value={form.product} onChange={(e) => setField('product', e.target.value)} /></div>
            <div><label>Material / Application</label><input className="input" value={form.material} onChange={(e) => setField('material', e.target.value)} /></div>
            <div><label>Quantity</label><input type="number" min="1" className="input" value={form.quantity} onChange={(e) => setField('quantity', e.target.value)} /></div>
            <div><label>Key Parameter 1</label><input className="input" value={form.keyParam1} onChange={(e) => setField('keyParam1', e.target.value)} /></div>
            <div><label>Key Parameter 2</label><input className="input" value={form.keyParam2} onChange={(e) => setField('keyParam2', e.target.value)} /></div>
            <div><label>Required Delivery</label><input className="input" placeholder="e.g. 12 weeks" value={form.requiredDelivery} onChange={(e) => setField('requiredDelivery', e.target.value)} /></div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: 12 }}>Capture Enquiry</button>
        </form>
      </div>
    </section>
  );
}
