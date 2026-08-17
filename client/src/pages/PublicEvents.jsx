import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { StatusBadge } from '../components/StatusBadge';
import { Radio, Calendar, MapPin, Users, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

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

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0f172a' }}>Networking Events & Conventions</h1>
        <p style={{ color: '#64748b' }}>Connect with buyers, venture investors, policymakers, and peer female founders</p>
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
          {events.map((e) => (
            <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-info">{e.event_type}</span>
                  <StatusBadge status={e.status} />
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
                    <Calendar size={14} color="#0d9488" /> <strong>Date & Time:</strong> {e.date} at {e.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <MapPin size={14} color="#0d9488" /> <strong>Venue & City:</strong> {e.venue}, {e.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Users size={14} color="#0d9488" /> <strong>Attendees:</strong> {e.current_participants} / {e.max_participants} Capacity
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>
                  Deadline: {e.deadline}
                </span>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Register Event Pass
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
