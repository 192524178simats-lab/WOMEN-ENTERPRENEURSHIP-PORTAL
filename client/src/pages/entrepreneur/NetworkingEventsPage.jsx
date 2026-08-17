import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { useToast } from '../../context/ToastContext';
import { Radio, Calendar, MapPin, Users, Ban, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NetworkingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [registeringId, setRegisteringId] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      let url = `/api/networking-events?search=${encodeURIComponent(search)}&status=Upcoming`;
      if (typeFilter !== 'All') url += `&event_type=${encodeURIComponent(typeFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, typeFilter]);

  const handleRegister = async (event) => {
    setRegisteringId(event.id);
    try {
      const res = await fetch(`/api/networking-events/${event.id}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Event pass confirmed!');
        fetchEvents();
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
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Networking Events</h1>
          <p style={{ color: '#64748b' }}>Conventions, buyer-seller meets, founder summits, and investor pitch days</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/entrepreneur/my-events')}>
          View My Event Passes →
        </button>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'event_type',
            label: 'Event Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'Women Entrepreneurs Forum', label: 'Women Entrepreneurs Forum' },
              { value: 'Startup Event', label: 'Startup & Pitch Event' },
              { value: 'Business Conference', label: 'Business Conference' },
              { value: 'Industry Meetup', label: 'Industry Meetup' },
              { value: 'Government-Industry Interaction', label: 'Government Policy Forum' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setTypeFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading networking events...</div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No networking events matched your search.</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((e) => {
            const isFull = e.current_participants >= e.max_participants;
            const today = new Date().toISOString().split('T')[0];
            const isPastDeadline = e.deadline < today;

            return (
              <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header">
                    <span className="badge badge-info">{e.event_type}</span>
                    <span className="badge badge-success">{e.city}</span>
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{e.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    Organizer: <strong>{e.organizer}</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                    {e.description}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <Calendar size={14} color="#0d9488" /> <strong>Date:</strong> {e.date} at {e.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <MapPin size={14} color="#0d9488" /> <strong>Venue:</strong> {e.venue}, {e.city}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <Users size={14} color="#0d9488" /> <strong>Attendees:</strong> {e.current_participants} / {e.max_participants}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  {isFull ? (
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                      <Ban size={16} /> Event Capacity Full
                    </button>
                  ) : isPastDeadline ? (
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                      <Ban size={16} /> Registration Deadline Passed
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={registeringId === e.id}
                      onClick={() => handleRegister(e)}
                    >
                      <Radio size={16} /> {registeringId === e.id ? 'Registering...' : 'Register for Event Pass'}
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
