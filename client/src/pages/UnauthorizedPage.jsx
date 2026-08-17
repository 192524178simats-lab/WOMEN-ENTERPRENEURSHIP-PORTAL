import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>403 - Access Denied</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
          You do not have administrative permission to access this page. This area is restricted to authorized roles.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
