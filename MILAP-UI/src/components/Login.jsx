import React, { useState } from 'react';
import { useApp } from '../manufacturing/context/AppContext.jsx';
import logoBrand from '../assets/MILAP_LOGO.png';

export default function Login({ onBack }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    login(email.trim());
  };

  return (
    <div className="login-wrap">
      <div className="login-panel">
        <div className="login-visual">
          <img src={logoBrand} alt="MILAP — Multi-Industry Linkage & Automation Platform" />
        </div>

        <div className="login-form-side">
          <div className="login-form-card">
            {onBack && <button type="button" className="login-back" onClick={onBack}>← Back to home</button>}
            <div className="login-brandmark">MILAP</div>
            <h2>Sign in to your workspace</h2>
            <div className="sub">Enter your credentials to access enquiries, quotations, orders and service.</div>

            <form onSubmit={submit}>
              <div className="field">
                <label>Work email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <div className="login-row">
                <label className="login-remember"><input type="checkbox" defaultChecked /> Keep me signed in</label>
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              <button type="submit" className="btn login-submit">Sign In</button>
            </form>

            <div className="login-footnote">Need access? Contact your MILAP administrator.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
