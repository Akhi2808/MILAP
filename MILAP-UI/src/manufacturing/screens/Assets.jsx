import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const emptyForm = { customerId: '', orderId: '', name: '', serialNumber: '', installedDate: '', warrantyExpiry: '', nextServiceDate: '' };

const STATUS_PILL = { OPERATIONAL: 'ok', MAINTENANCE_DUE: 'warn', DOWN: 'bad' };

export default function Assets() {
  const { assets, customers, orders, createAsset, go, setSelectedAssetId } = useApp();
  const [form, setForm] = useState(emptyForm);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.name.trim() || !form.serialNumber.trim()) return;
    await createAsset(Number(form.customerId), form.orderId ? Number(form.orderId) : null, {
      name: form.name,
      serialNumber: form.serialNumber,
      installedDate: form.installedDate || null,
      warrantyExpiry: form.warrantyExpiry || null,
      nextServiceDate: form.nextServiceDate || null,
    });
    setForm(emptyForm);
  };

  const openService = (assetId) => {
    setSelectedAssetId(assetId);
    go('service');
  };

  return (
    <section id="assets" className="screen active">
      <div className="hero"><div><h1>Installed Equipment / Assets</h1><div className="sub">Track installed base, warranty, service history and lifecycle.</div></div></div>

      <div className="grid three">
        {assets.length === 0 && <div className="card sub">No assets registered yet.</div>}
        {assets.map((a) => (
          <div className="card" key={a.id}>
            <h2>{a.name}</h2>
            <div className="sub">Serial: {a.serialNumber}</div>
            <div className="sub">{a.customer?.name}</div>
            <p><span className={`pill ${STATUS_PILL[a.status] || ''}`}>{a.status}</span></p>
            <p>
              Installed: {a.installedDate || '—'}<br />
              Warranty: {a.warrantyExpiry || '—'}<br />
              Next Service: {a.nextServiceDate || '—'}
            </p>
            <button className="btn small" onClick={() => openService(a.id)}>Open Service</button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Register Asset</h2>
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
              <label>Originating Order (optional)</label>
              <select value={form.orderId} onChange={(e) => setField('orderId', e.target.value)}>
                <option value="">None</option>
                {orders.map((o) => <option key={o.id} value={o.id}>{o.code}</option>)}
              </select>
            </div>
            <div><label>Name</label><input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} required /></div>
            <div><label>Serial Number</label><input className="input" value={form.serialNumber} onChange={(e) => setField('serialNumber', e.target.value)} required /></div>
            <div><label>Installed Date</label><input type="date" className="input" value={form.installedDate} onChange={(e) => setField('installedDate', e.target.value)} /></div>
            <div><label>Warranty Expiry</label><input type="date" className="input" value={form.warrantyExpiry} onChange={(e) => setField('warrantyExpiry', e.target.value)} /></div>
            <div><label>Next Service Date</label><input type="date" className="input" value={form.nextServiceDate} onChange={(e) => setField('nextServiceDate', e.target.value)} /></div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: 12 }}>Register Asset</button>
        </form>
      </div>
    </section>
  );
}
