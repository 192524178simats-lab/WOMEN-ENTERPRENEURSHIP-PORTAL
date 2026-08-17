import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Calendar, MapPin, Users, CheckCircle, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrainingProgramsPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [registeringId, setRegisteringId] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

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

  const handleRegister = async (training) => {
    setRegisteringId(training.id);
    try {
      const res = await fetch(`/api/training/${training.id}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Successfully registered for training!');
        fetchTrainings();
      } else {
        addToast('error', data.error || 'Registration failed.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Training Programs & Workshops</h1>
          <p style={{ color: '#64748b' }}>Free skill development, financial literacy, export logistics, and digital marketing workshops</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/entrepreneur/my-training')}>
          View My Registered Trainings →
        </button>
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
          {trainings.map((t) => {
            const isFull = t.current_participants >= t.max_participants;
            const today = new Date().toISOString().split('T')[0];
            const isPastDeadline = t.deadline < today;

            return (
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
                      <MapPin size={14} color="#0d9488" /> <strong>Venue:</strong> {t.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <Users size={14} color="#0d9488" /> <strong>Enrollment:</strong> {t.current_participants} / {t.max_participants}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  {isFull ? (
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                      <Ban size={16} /> Program Full
                    </button>
                  ) : isPastDeadline ? (
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                      <Ban size={16} /> Registration Deadline Passed
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={registeringId === t.id}
                      onClick={() => handleRegister(t)}
                    >
                      <GraduationCap size={16} /> {registeringId === t.id ? 'Registering...' : 'Register for Program'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
