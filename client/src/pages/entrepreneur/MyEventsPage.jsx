import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Radio, Calendar, MapPin, Ban, CheckCircle } from 'lucide-react';

export const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchMyEvents = async () => {
    try {
      const res = await fetch('/api/networking-events/my-events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch registered events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancel = async (id, name) => {
    if (!window.confirm(`Are you sure you want to cancel your pass for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/networking-events/${id}/register`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('info', data.message || 'Pass cancelled.');
        fetchMyEvents();
      } else {
        addToast('error', data.error || 'Failed to cancel pass.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>My Event Passes & Registrations</h1>
        <p style={{ color: '#64748b' }}>View confirmed entry passes for conventions and buyer-seller meets</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading event passes...</div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Radio size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#0f172a' }}>No Event Passes Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            You have not registered for any networking events yet.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((e) => (
            <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-success">Confirmed Pass</span>
                  <span className="badge badge-info">{e.city}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{e.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Organizer: <strong>{e.organizer}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Calendar size={14} color="#0d9488" /> <strong>Date:</strong> {e.date} at {e.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <MapPin size={14} color="#0d9488" /> <strong>Venue:</strong> {e.venue}, {e.city}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleCancel(e.event_id, e.name)}
                >
                  <Ban size={14} /> Cancel Event Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
