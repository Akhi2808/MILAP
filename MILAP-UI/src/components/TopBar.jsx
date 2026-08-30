import React from 'react';
import { useApp } from '../manufacturing/context/AppContext.jsx';
import logoIcon from '../assets/MILAP_LOGO.png';
import { IconSearch, IconBell, IconLogout } from './icons.jsx';

function initialsFromEmail(email) {
  const local = (email || '').split('@')[0] || 'U';
  const parts = local.replace(/[._-]+/g, ' ').trim().split(' ').filter(Boolean);
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2);
  return letters.toUpperCase();
}

export default function TopBar() {
  const { loggedIn, userEmail, logout } = useApp();

  return (
    <div className="topbar">
      <div className="brand">
        <div className="reference-logo-tile" title="MILAP — Multi-Industry Linkage & Automation Platform">
          <img className="logo-crop" src={logoIcon} alt="MILAP logo" />
        </div>
        <div className="brandcopy">
          <b>MILAP</b>
          <span>Multi-Industry Linkage & Automation Platform</span>
        </div>
      </div>

      {loggedIn && (
        <div className="topbar-search">
          <IconSearch />
          <input placeholder="Search enquiries, orders, customers…" />
        </div>
      )}

      <div className="top-actions">
        {loggedIn ? (
          <>
            <button className="icon-btn" title="Notifications" aria-label="Notifications">
              <IconBell />
            </button>
            <div className="user-chip">
              <div className="user-avatar">{initialsFromEmail(userEmail)}</div>
              <div className="user-chip-copy">
                <b>{userEmail}</b>
                <span>Signed in</span>
              </div>
            </div>
            <button className="icon-btn" title="Sign out" aria-label="Sign out" onClick={logout}>
              <IconLogout />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
