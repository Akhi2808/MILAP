import React from 'react';
import logoBrand from '../assets/MILAP_LOGO.png';
import logoIcon from '../assets/MILAP_LOGO.png';

const INDUSTRIES = [
  { key: 'manufacturing', icon: '🏭', name: 'Manufacturing', desc: 'Enquiries, quotations, orders, installed assets and service.', live: true },
  { key: 'transport', icon: '🚚', name: 'Transport', desc: 'Fleet, shipments, routes and logistics billing.', live: false },
  { key: 'education', icon: '🎓', name: 'Education', desc: 'Admissions, courses, students and fee management.', live: false },
  { key: 'realestate', icon: '🏢', name: 'Real Estate', desc: 'Properties, leads, site visits and bookings.', live: false },
];

export default function Home({ onSignIn }) {
  const scrollToIndustries = () => document.getElementById('home-industries')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home">
      <header className="home-nav">
        <div className="home-nav-brand">
          <span className="logo-crop-wrap"><img className="logo-crop" src={logoIcon} alt="MILAP" /></span>
          <span>MILAP</span>
        </div>
        <nav className="home-nav-links">
          <a href="#home-industries" onClick={(e) => { e.preventDefault(); scrollToIndustries(); }}>Industries</a>
          <a href="#home-pillars" onClick={(e) => { e.preventDefault(); document.getElementById('home-pillars')?.scrollIntoView({ behavior: 'smooth' }); }}>How it works</a>
        </nav>
        <button className="btn" onClick={onSignIn}>Sign In</button>
      </header>

      <section className="home-hero">
        <img className="home-hero-logo" src={logoBrand} alt="MILAP — Multi-Industry Linkage & Automation Platform" />
        <div className="home-badge">B2B Platform</div>
        <h1>One platform to run and connect every industry business.</h1>
        <p className="home-hero-sub">
          MILAP gives your company the operational software your industry needs — and a way to find and
          connect with other businesses that help you grow. One login, both sides of your business.
        </p>
        <div className="home-hero-actions">
          <button className="btn login-submit" onClick={onSignIn}>Get Started</button>
          <button className="btn ghost" onClick={scrollToIndustries}>Explore Industries</button>
        </div>
      </section>

      <section id="home-pillars" className="home-pillars">
        <div className="home-pillar card">
          <div className="home-pillar-icon">⚙️</div>
          <h2>Industry Workspaces</h2>
          <p className="sub">
            Every client gets the screens their industry actually runs on — enquiries, quotations, orders,
            service, and more — without adopting a generic one-size-fits-all tool.
          </p>
        </div>
        <div className="home-pillar card">
          <div className="home-pillar-icon">🤝</div>
          <h2>Connect</h2>
          <p className="sub">
            Discover and connect with companies in other industries that can help your business grow —
            find a logistics partner, a supplier, or a customer, right from your workspace.
          </p>
        </div>
      </section>

      <section id="home-industries" className="home-industries">
        <div className="hero" style={{ marginBottom: 4 }}>
          <div><h2>Industries on MILAP</h2><div className="sub">Manufacturing is live today. More industries are on the way.</div></div>
        </div>
        <div className="grid four home-industries-grid">
          {INDUSTRIES.map((ind) => (
            <div className="card home-industry-card" key={ind.key}>
              <div className="home-industry-icon">{ind.icon}</div>
              <b>{ind.name}</b>
              <p className="sub">{ind.desc}</p>
              {ind.live
                ? <button className="btn small" onClick={onSignIn}>Open Workspace</button>
                : <span className="pill">Coming soon</span>}
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-nav-brand">
          <span className="logo-crop-wrap"><img className="logo-crop" src={logoIcon} alt="MILAP" /></span>
          <span>MILAP</span>
        </div>
        <div className="sub">© {new Date().getFullYear()} MILAP. Multi-Industry Linkage & Automation Platform.</div>
      </footer>
    </div>
  );
}
