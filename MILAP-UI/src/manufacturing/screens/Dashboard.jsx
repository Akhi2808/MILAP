import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconEnquiries, IconQuotation, IconOrders, IconService, IconAskAI, IconCustomers, IconPlug } from '../../components/icons.jsx';

export default function Dashboard() {
  const { go, showToast, dashboardSummary, orders, loading, loadError } = useApp();

  const atRiskOrders = orders.filter((o) => o.riskNotes);
  const rowsToShow = (atRiskOrders.length ? atRiskOrders : orders).slice(0, 5);

  const {
    newEnquiries = 0,
    pendingQuotations = 0,
    activeOrders = 0,
    openServiceTickets = 0,
    highPriorityOpenTickets = 0,
  } = dashboardSummary;

  return (
    <section id="dashboard" className="screen active">
      <div className="hero">
        <div>
          <h1>Executive Dashboard</h1>
          <div className="sub">One view of sales, execution, installed equipment and service.</div>
        </div>
        <div className="toolbar">
          <button className="btn ghost" onClick={() => go('enquiries')}>+ New Enquiry</button>
          <button className="btn" onClick={() => go('askai')}>Ask AI</button>
        </div>
      </div>

      {loadError && <div className="card callout" style={{ marginBottom: 14 }}>{loadError}</div>}

      <div className="grid kpis">
        <div className="card kpi"><div className="kpi-icon blue"><IconEnquiries /></div><div className="label">New Enquiries</div><div className="value">{newEnquiries}</div></div>
        <div className="card kpi"><div className="kpi-icon purple"><IconQuotation /></div><div className="label">Pending Quotations</div><div className="value">{pendingQuotations}</div></div>
        <div className="card kpi"><div className="kpi-icon teal"><IconOrders /></div><div className="label">Active Orders / Projects</div><div className="value">{activeOrders}</div></div>
        <div className="card kpi"><div className="kpi-icon orange"><IconService /></div><div className="label">Open Service Tickets</div><div className="value">{openServiceTickets}</div><div className="trend warn">{highPriorityOpenTickets} high priority</div></div>
      </div>

      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <h2>Business Health</h2>
          <div className="tablewrap" style={{ marginTop: 14 }}>
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Stage</th><th>Risk</th></tr></thead>
              <tbody>
                {rowsToShow.length === 0 && !loading && (
                  <tr><td colSpan="4" className="sub">No orders yet.</td></tr>
                )}
                {rowsToShow.map((o) => (
                  <tr key={o.id}>
                    <td>{o.code}</td>
                    <td>{o.customer?.name}</td>
                    <td>{o.currentStage}</td>
                    <td>{o.riskNotes ? <span className="pill bad">{o.riskNotes}</span> : <span className="pill ok">On track</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card ai">
          <div className="aihead">✦ Summary</div>
          <p>{activeOrders} active order(s), {pendingQuotations} quotation(s) pending, {openServiceTickets} open service ticket(s) ({highPriorityOpenTickets} high priority).</p>
          <button className="btn small" style={{ marginTop: 12 }} onClick={() => go('askai')}>Open AI Assistant</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="hero" style={{ marginBottom: 10 }}>
          <div><h2>What MILAP can solve</h2><div className="sub">Choose a business problem and jump directly to the relevant workflow.</div></div>
        </div>
        <div className="action-panel">
          <div className="action-card" onClick={() => go('enquiries')}><div className="action-card-icon blue"><IconQuotation /></div><b>RFQ & Quotation Automation</b><div className="statusline">Capture requirements and build compliant quotations</div></div>
          <div className="action-card" onClick={() => go('orders')}><div className="action-card-icon teal"><IconOrders /></div><b>Order & Project Visibility</b><div className="statusline">Track engineering, procurement, production and delivery risks</div></div>
          <div className="action-card" onClick={() => go('service')}><div className="action-card-icon orange"><IconService /></div><b>Service & AMC Automation</b><div className="statusline">Installed base, service history, engineer assignment</div></div>
          <div className="action-card" onClick={() => go('askai')}><div className="action-card-icon purple"><IconAskAI /></div><b>AI Knowledge Assistant</b><div className="statusline">Search manuals, SOPs, catalogues and warranty information</div></div>
          <div className="action-card" onClick={() => go('customers')}><div className="action-card-icon blue"><IconCustomers /></div><b>Customer 360</b><div className="statusline">Accounts, open enquiries, active orders and installed base</div></div>
          <div className="action-card" onClick={() => showToast('Integration demo: ERP, Tally, CRM, email and Excel connectors can be added during a pilot.')}><div className="action-card-icon teal"><IconPlug /></div><b>ERP / Excel Integration</b><div className="statusline">Keep existing systems and automate the gaps around them</div></div>
        </div>
      </div>
    </section>
  );
}
