import React from 'react';
import { useApp } from '../manufacturing/context/AppContext.jsx';
import {
  IconDashboard, IconCustomers, IconEnquiries, IconQuotation,
  IconOrders, IconAssets, IconService, IconAskAI,
} from './icons.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'customers', label: 'Customers', Icon: IconCustomers },
  { id: 'enquiries', label: 'Enquiries', Icon: IconEnquiries },
  { id: 'quotation', label: 'Quotation', Icon: IconQuotation },
  { id: 'orders', label: 'Orders / Projects', Icon: IconOrders },
  { id: 'assets', label: 'Installed Base', Icon: IconAssets },
  { id: 'service', label: 'Service / AMC', Icon: IconService },
  { id: 'askai', label: 'Ask AI', Icon: IconAskAI },
];

export default function Sidebar() {
  const { screen, go } = useApp();
  return (
    <aside className="sidebar">
      <div className="side-title">Workspace</div>
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`navbtn${screen === id ? ' active' : ''}`}
          onClick={() => go(id)}
        >
          <Icon className="navbtn-icon" />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
