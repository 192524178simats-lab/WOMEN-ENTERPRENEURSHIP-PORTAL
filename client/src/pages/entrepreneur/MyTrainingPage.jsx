import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Calendar, MapPin, Ban, CheckCircle } from 'lucide-react';

export const MyTrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchMyTrainings = async () => {
    try {
      const res = await fetch('/api/training/my-registrations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      console.error('Failed to fetch registered training programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTrainings();
  }, []);

  const handleCancel = async (id, name) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/training/${id}/register`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('info', data.message || 'Registration cancelled.');
        fetchMyTrainings();
      } else {
        addToast('error', data.error || 'Failed to cancel registration.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>My Registered Training Programs</h1>
        <p style={{ color: '#64748b' }}>View confirmed workshop registrations and attendance details</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading registrations...</div>
      ) : trainings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <GraduationCap size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#0f172a' }}>No Registered Programs</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            You have not registered for any training programs yet.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {trainings.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-success">Confirmed Seat</span>
                  <span className="badge badge-info">{t.mode}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{t.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Trainer: <strong>{t.trainer}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Calendar size={14} color="#0d9488" /> <strong>Date:</strong> {t.date} ({t.start_time} - {t.end_time})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <MapPin size={14} color="#0d9488" /> <strong>Location:</strong> {t.location}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleCancel(t.training_id, t.name)}
                >
                  <Ban size={14} /> Cancel Registration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
