import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { FileSpreadsheet, Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EntrepreneurSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const navigate = useNavigate();

  const fetchSchemes = async () => {
    try {
      let url = `/api/schemes?search=${encodeURIComponent(search)}&status=Active`;
      if (sectorFilter !== 'All') url += `&sector=${encodeURIComponent(sectorFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      setSchemes(data);
    } catch (err) {
      console.error('Failed to fetch schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [search, sectorFilter]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Government Support Schemes</h1>
        <p style={{ color: '#64748b' }}>Explore capital subsidy, soft loan subvention, and technology modernization initiatives</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'sector',
            label: 'Sectors',
            value: sectorFilter,
            onChange: setSectorFilter,
            options: [
              { value: 'Textiles & Handicrafts', label: 'Textiles & Handicrafts' },
              { value: 'Biotechnology & Healthcare', label: 'Biotechnology & Healthcare' },
              { value: 'Agriculture & Food Processing', label: 'Agriculture & Food Processing' },
              { value: 'Technology & CleanTech', label: 'Technology & CleanTech' },
              { value: 'Export & Trade', label: 'Export & Trade' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setSectorFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading schemes...</div>
      ) : schemes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No schemes matched your search criteria.</p>
        </div>
      ) : (
        <div className="card-grid">
          {schemes.map((s) => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0d9488' }}>{s.scheme_code}</span>
                  <StatusBadge status={s.status} />
                </div>
                <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={14} /> {s.department}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.description}
                </p>
                <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: '700', color: '#15803d' }}>
                    Funding: ₹{s.min_funding?.toLocaleString()} - ₹{s.max_funding?.toLocaleString()}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                    Target: {s.target_sector}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedScheme(s)}>
                  View Scheme Guidelines
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/entrepreneur/funding')}>
                  Apply Funding
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedScheme && (
        <Modal isOpen={!!selectedScheme} onClose={() => setSelectedScheme(null)} title={selectedScheme.name}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-info">{selectedScheme.scheme_code}</span>
              <StatusBadge status={selectedScheme.status} />
              <span className="badge badge-success">{selectedScheme.target_sector}</span>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Department</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedScheme.department}</p>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Description & Scope</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedScheme.description}</p>
            </div>

            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ color: '#15803d', marginBottom: '0.25rem' }}>Benefits & Financial Assistance</h4>
              <p style={{ color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>{selectedScheme.benefits}</p>
              <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '4px' }}>
                Maximum Grant Allowed: ₹{selectedScheme.max_funding?.toLocaleString()}
              </div>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Eligibility Criteria</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedScheme.eligibility}</p>
            </div>

            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Required Supporting Documents</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{selectedScheme.required_docs}</p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedScheme(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setSelectedScheme(null); navigate('/entrepreneur/funding'); }}>Apply for Funding Grant</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
