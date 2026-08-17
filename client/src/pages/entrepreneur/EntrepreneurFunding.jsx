import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { FundingApplicationModal } from './FundingApplicationModal';
import { Banknote, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EntrepreneurFunding = () => {
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedFunding, setSelectedFunding] = useState(null);

  const navigate = useNavigate();

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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Funding Opportunities</h1>
          <p style={{ color: '#64748b' }}>Apply for government capital grants, subsidies, and seed capital</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/entrepreneur/applications')}>
          View My Submitted Applications →
        </button>
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
              { value: 'Business Development Assistance', label: 'Business Development Assistance' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setTypeFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading funding catalog...</div>
      ) : funding.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No active funding opportunities match your search.</p>
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
                    Allowed Grant: ₹{f.min_amount?.toLocaleString()} - ₹{f.max_amount?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> Application Deadline: {f.deadline}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedFunding(f)}
                >
                  <Banknote size={16} /> Apply for Funding
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFunding && (
        <FundingApplicationModal
          isOpen={!!selectedFunding}
          onClose={() => setSelectedFunding(null)}
          funding={selectedFunding}
          onSuccess={() => navigate('/entrepreneur/applications')}
        />
      )}
    </div>
  );
};
