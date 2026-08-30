import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const STAGES = ['ORDER', 'ENGINEERING', 'PROCUREMENT', 'PRODUCTION', 'TESTING', 'DISPATCH', 'INSTALLATION'];

export default function Orders() {
  const { orders, selectedOrderId, setSelectedOrderId } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <section id="orders" className="screen active">
      <div className="hero"><div><h1>Orders & Execution</h1><div className="sub">From order acceptance to engineering, procurement, production, testing, dispatch and installation.</div></div></div>

      <div className="card tablewrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Stage</th><th>Risk</th><th></th></tr></thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan="5" className="sub">No orders yet. Convert an approved quotation from the Quotation screen.</td></tr>}
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.code}</td>
                <td>{o.customer?.name}</td>
                <td>{o.currentStage}</td>
                <td>{o.riskNotes ? <span className="pill bad">{o.riskNotes}</span> : <span className="pill ok">On track</span>}</td>
                <td><button className="btn small" onClick={() => setSelectedOrderId(o.id)}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {order && (
        <>
          <div className="card" style={{ marginTop: 14 }}>
            <h2>{order.code} — {order.customer?.name}</h2>
            <div className="stepper">
              {STAGES.map((s) => (
                <span key={s} className={`step${s === order.currentStage ? ' current' : ''}`}>{s}</span>
              ))}
            </div>
            <div className="grid three">
              <div className="callout"><b>Engineering</b><br />{order.engineeringProgressPercent ?? 0}% complete</div>
              <div className="callout"><b>Procurement</b><br />{order.procurementProgressPercent ?? 0}% complete</div>
              <div className="callout"><b>Current Stage</b><br />{order.currentStage}</div>
            </div>
          </div>

          <div className="card ai" style={{ marginTop: 14 }}>
            <div className="aihead">✦ Risk Notes</div>
            <p>{order.riskNotes || 'No risk notes recorded for this order.'}</p>
          </div>
        </>
      )}
    </section>
  );
}
