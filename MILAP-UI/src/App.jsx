import React, { useState } from 'react';
import { AppProvider, useApp } from './manufacturing/context/AppContext.jsx';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './components/Login.jsx';
import QuoteModal from './manufacturing/components/QuoteModal.jsx';
import Toast from './components/Toast.jsx';
import Home from './screens/Home.jsx';
import Dashboard from './manufacturing/screens/Dashboard.jsx';
import Customers from './manufacturing/screens/Customers.jsx';
import Enquiries from './manufacturing/screens/Enquiries.jsx';
import Quotation from './manufacturing/screens/Quotation.jsx';
import Orders from './manufacturing/screens/Orders.jsx';
import Assets from './manufacturing/screens/Assets.jsx';
import Service from './manufacturing/screens/Service.jsx';
import AskAI from './manufacturing/screens/AskAI.jsx';

const SCREENS = {
  dashboard: Dashboard,
  customers: Customers,
  enquiries: Enquiries,
  quotation: Quotation,
  orders: Orders,
  assets: Assets,
  service: Service,
  askai: AskAI,
};

function Shell() {
  const { screen } = useApp();
  const ScreenComponent = SCREENS[screen] || Dashboard;
  return (
    <div id="app" className="shell">
      <Sidebar />
      <main className="main">
        <ScreenComponent />
      </main>
    </div>
  );
}

function AppInner() {
  const { loggedIn } = useApp();
  const [showLogin, setShowLogin] = useState(true);

  if (!loggedIn) {
    return (
      <>
        {showLogin ? <Login onBack={() => setShowLogin(false)} /> : <Home onSignIn={() => setShowLogin(true)} />}
        <Toast />
      </>
    );
  }
  return (
    <>
      <TopBar />
      <Shell />
      <QuoteModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
