import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Briefcase, Mail, Phone, Building2 } from 'lucide-react';

export const MentoredEntrepreneursPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssigned = async () => {
    try {
      const res = await fetch('/api/mentors/requests/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setRequests(data.filter(r => r.status === 'Accepted' || r.status === 'Completed'));
    } catch (err) {
      console.error('Failed to fetch assigned entrepreneurs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Assigned Entrepreneurs</h1>
        <p style={{ color: '#64748b' }}>Female founders currently receiving strategic mentorship</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading assigned entrepreneurs...</div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No assigned entrepreneurs found.</p>
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="card-header">
                <span className="badge badge-success">{r.sector}</span>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{r.entrepreneur_name}</h3>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0d9488', marginBottom: '0.75rem' }}>
                {r.business_name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {r.entrepreneur_email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {r.entrepreneur_phone || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
