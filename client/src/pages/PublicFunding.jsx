import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Banknote, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicFunding = () => {
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedFunding, setSelectedFunding] = useState(null);

  const fetchFunding = async () => {
    try {
      let url = `/api/funding?search=${encodeURIComponent(search)}&status=Active`;
      if (typeFilter !== 'All') url += `&funding_type=${encodeURIComponent(typeFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setFunding(data);
    } catch (err) {
      console.error('Failed to fetch funding:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, [search, typeFilter]);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0f172a' }}>Funding & Capital Opportunities</h1>
        <p style={{ color: '#64748b' }}>Discover grants, subsidies, micro-loans, and seed capital opportunities</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'funding_type',
            label: 'Funding Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'Government Grant', label: 'Government Grant' },
              { value: 'Subsidy', label: 'Subsidy' },
              { value: 'Loan', label: 'Concessional Loan' },
              { value: 'Startup Funding', label: 'Startup Seed Capital' },
              { value: 'Business Development Assistance', label: 'Business Assistance' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setTypeFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading funding opportunities...</div>
      ) : funding.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No funding opportunities matched your search.</p>
        </div>
      ) : (
        <div className="card-grid">
          {funding.map((f) => (
            <div key={f.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-info">{f.funding_type}</span>
                  <StatusBadge status={f.status} />
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{f.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Provider: <strong>{f.provider}</strong>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {f.description}
                </p>
                <div style={{ marginTop: '1rem', background: '#f0fdf4', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>
                    ₹{f.min_amount?.toLocaleString()} - ₹{f.max_amount?.toLocaleString()}
                  </div>
                  {f.interest_rate > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: '600', marginTop: '2px' }}>
                      Interest Rate: {f.interest_rate}% p.a.
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> Deadline: {f.deadline}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedFunding(f)}>
                  View Eligibility
                </button>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Apply for Grant
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFunding && (
        <Modal isOpen={!!selectedFunding} onClose={() => setSelectedFunding(null)} title={selectedFunding.name}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-info">{selectedFunding.funding_type}</span>
              <span className="badge badge-success">Up to ₹{selectedFunding.max_amount?.toLocaleString()}</span>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Provider Agency</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedFunding.provider}</p>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Description & Objectives</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedFunding.description}</p>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Eligibility Criteria</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedFunding.eligibility}</p>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Required Application Documents</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedFunding.required_docs}</p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedFunding(null)}>Close</button>
              <Link to="/login" className="btn btn-primary">Login to Apply</Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
