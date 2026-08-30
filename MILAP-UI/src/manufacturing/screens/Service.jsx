import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const emptyForm = { customerId: '', assetId: '', issueDescription: '', priority: 'MEDIUM' };

const STATUS_PILL = { UNASSIGNED: 'warn', ASSIGNED: '', IN_PROGRESS: 'warn', COMPLETED: 'ok' };

export default function Service() {
  const {
    serviceTickets, customers, assets, engineers,
    selectedTicketId, setSelectedTicketId, selectedAssetId,
    createServiceTicket, assignEngineer, startService, completeService,
  } = useApp();

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [engineerChoice, setEngineerChoice] = useState('');

  const ticket = serviceTickets.find((t) => t.id === selectedTicketId)
    || serviceTickets.find((t) => t.status !== 'COMPLETED')
    || serviceTickets[0];

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const startNewTicket = () => {
    setForm({ ...emptyForm, assetId: selectedAssetId || '' });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.assetId || !form.issueDescription.trim()) return;
    const created = await createServiceTicket(Number(form.customerId), Number(form.assetId), {
      issueDescription: form.issueDescription,
      priority: form.priority,
    });
    if (created) {
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  const doAssign = () => {
    if (!engineerChoice || !ticket) return;
    assignEngineer(ticket.id, Number(engineerChoice));
    setEngineerChoice('');
  };

  return (
    <section id="service" className="screen active">
      <div className="hero">
        <div><h1>Service & AMC</h1><div className="sub">Service requests, engineer assignment, and preventive maintenance.</div></div>
        <button className="btn" onClick={startNewTicket}>+ New Ticket</button>
      </div>

      <div className="card tablewrap">
        <table>
          <thead><tr><th>Ticket</th><th>Customer</th><th>Asset</th><th>Priority</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {serviceTickets.length === 0 && <tr><td colSpan="6" className="sub">No service tickets yet.</td></tr>}
            {serviceTickets.map((t) => (
              <tr key={t.id}>
                <td>{t.code}</td>
                <td>{t.customer?.name}</td>
                <td>{t.asset?.name}</td>
                <td>{t.priority}</td>
                <td><span className={`pill ${STATUS_PILL[t.status] || ''}`}>{t.status}</span></td>
                <td><button className="btn small" onClick={() => setSelectedTicketId(t.id)}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="card" style={{ marginTop: 14 }}>
          <h2>New Service Ticket</h2>
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
                <label>Asset</label>
                <select value={form.assetId} onChange={(e) => setField('assetId', e.target.value)} required>
                  <option value="">Select asset</option>
                  {assets.filter((a) => !form.customerId || a.customer?.id === Number(form.customerId)).map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setField('priority', e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="full"><label>Issue Description</label><textarea rows="3" value={form.issueDescription} onChange={(e) => setField('issueDescription', e.target.value)} required /></div>
            </div>
            <button className="btn" type="submit" style={{ marginTop: 12 }}>Create Ticket</button>
          </form>
        </div>
      )}

      {ticket && (
        <div className="card" style={{ marginTop: 14 }}>
          <h2>{ticket.code} — {ticket.priority}</h2>
          <div className="statusline">
            <span className={`pill ${STATUS_PILL[ticket.status] || ''}`}>{ticket.status}{ticket.assignedEngineer ? ` — ${ticket.assignedEngineer.name}` : ''}</span>
          </div>
          <p><b>Customer:</b> {ticket.customer?.name}<br /><b>Asset:</b> {ticket.asset?.name}<br /><b>Issue:</b> {ticket.issueDescription}</p>
          {ticket.previousIssueNote && <div className="callout"><b>Previous issue:</b> {ticket.previousIssueNote}</div>}

          {ticket.status === 'UNASSIGNED' && (
            <div className="flex" style={{ marginTop: 12 }}>
              <select value={engineerChoice} onChange={(e) => setEngineerChoice(e.target.value)}>
                <option value="">Select engineer</option>
                {engineers.map((eng) => <option key={eng.id} value={eng.id}>{eng.name}</option>)}
              </select>
              <button className="btn secondary" onClick={doAssign}>Assign Engineer</button>
            </div>
          )}
          {ticket.status === 'ASSIGNED' && (
            <div className="flex" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => startService(ticket.id)}>Start Service</button>
            </div>
          )}
          {ticket.status === 'IN_PROGRESS' && (
            <div className="flex" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => completeService(ticket.id)}>Mark Completed</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
