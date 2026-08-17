import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { StatusBadge } from '../components/StatusBadge';
import { GraduationCap, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const fetchTrainings = async () => {
    try {
      let url = `/api/training?search=${encodeURIComponent(search)}&status=Upcoming`;
      if (catFilter !== 'All') url += `&category=${encodeURIComponent(catFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      console.error('Failed to fetch trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [search, catFilter]);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0f172a' }}>Business Training Programs</h1>
        <p style={{ color: '#64748b' }}>Capacity building workshops, digital literacy, and executive masterclasses for female founders</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: catFilter,
            onChange: setCatFilter,
            options: [
              { value: 'Financial Literacy', label: 'Financial Literacy' },
              { value: 'Digital Marketing', label: 'Digital Marketing' },
              { value: 'Export Management', label: 'Export Management' },
              { value: 'Leadership', label: 'Leadership' },
              { value: 'Technology', label: 'Technology' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setCatFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading training programs...</div>
      ) : trainings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No training programs matched your search.</p>
        </div>
      ) : (
        <div className="card-grid">
          {trainings.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-info">{t.category}</span>
                  <span className={`badge ${t.mode === 'Online' ? 'badge-success' : 'badge-warning'}`}>{t.mode}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{t.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: '600' }}>
                  Trainer: {t.trainer}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                  {t.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Calendar size={14} color="#0d9488" /> <strong>Date:</strong> {t.date} ({t.start_time} - {t.end_time})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <MapPin size={14} color="#0d9488" /> <strong>Location:</strong> {t.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Users size={14} color="#0d9488" /> <strong>Enrollments:</strong> {t.current_participants} / {t.max_participants} Seats Filled
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>
                  Deadline: {t.deadline}
                </span>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Register for Training
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
