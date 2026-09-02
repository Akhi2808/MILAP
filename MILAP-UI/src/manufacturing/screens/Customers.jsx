import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Customers() {
  const { customers, enquiries, orders, assets, createCustomer } = useApp();
  const [form, setForm] = useState({ name: '', industry: '', contactPerson: '', email: '', phone: '', address: '' });

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    createCustomer(form);
    setForm({ name: '', industry: '', contactPerson: '', email: '', phone: '', address: '' });
  };

  const countFor = (customerId) => ({
    openEnquiries: enquiries.filter((e) => e.customer?.id === customerId && e.status !== 'CLOSED').length,
    activeOrders: orders.filter((o) => o.customer?.id === customerId && o.currentStage !== 'INSTALLATION').length,
    installedAssets: assets.filter((a) => a.customer?.id === customerId).length,
  });

  return (
    <section id="customers" className="screen active">
      <div className="hero"><div><h1>Customers</h1><div className="sub">Accounts, opportunities, installed base and service history.</div></div></div>
      <div className="card tablewrap">
        <table>
          <thead><tr><th>Customer</th><th>Industry</th><th>Open Enquiries</th><th>Active Orders</th><th>Installed Assets</th></tr></thead>
          <tbody>
            {customers.length === 0 && <tr><td colSpan="5" className="sub">No customers yet. Add one below.</td></tr>}
            {customers.map((c) => {
              const counts = countFor(c.id);
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.industry}</td>
                  <td>{counts.openEnquiries}</td>
                  <td>{counts.activeOrders}</td>
                  <td>{counts.installedAssets}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Add Customer</h2>
        <form onSubmit={submit}>
          <div className="formgrid">
            <div><label>Name</label><input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} required /></div>
            <div><label>Industry</label><input className="input" value={form.industry} onChange={(e) => setField('industry', e.target.value)} /></div>
            <div><label>Contact Person</label><input className="input" value={form.contactPerson} onChange={(e) => setField('contactPerson', e.target.value)} /></div>
            <div><label>Email</label><input type="email" className="input" value={form.email} onChange={(e) => setField('email', e.target.value)} required /></div>
            <div><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} /></div>
            <div className="full"><label>Address</label><input className="input" value={form.address} onChange={(e) => setField('address', e.target.value)} /></div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: 12 }}>Add Customer</button>
        </form>
      </div>
    </section>
  );
}
