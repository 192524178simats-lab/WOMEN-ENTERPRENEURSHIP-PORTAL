import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Radio, Plus } from 'lucide-react';

export const NetworkingManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: 'Bharat Mandapam',
    city: 'New Delhi',
    event_type: 'Women Entrepreneurs Forum',
    max_participants: '200',
    deadline: '2026-11-30',
    organizer: 'Ministry of MSME',
    status: 'Upcoming'
  });

  const { addToast } = useToast();

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/networking-events?status=All');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch networking events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/networking-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Networking event created!');
        setModalOpen(false);
        fetchEvents();
      } else {
        addToast('error', data.error || 'Failed to create event.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Networking Events Management</h1>
          <p style={{ color: '#64748b' }}>Create conventions, founder summits, and buyer-seller meets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Create Networking Event
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading events...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Event Name & Organizer</th>
                <th>Event Type</th>
                <th>City & Venue</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: '800', color: '#0d9488' }}>{e.event_code}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{e.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.organizer}</div>
                  </td>
                  <td><span className="badge badge-info">{e.event_type}</span></td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{e.city}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.venue}</div>
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{e.date}</td>
                  <td style={{ fontWeight: '700', color: '#0d9488' }}>
                    {e.current_participants} / {e.max_participants}
                  </td>
                  <td><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Networking Event">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Event Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Organizer *</label>
                <input type="text" className="form-control" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Event Type *</label>
                <select className="form-control" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}>
                  <option value="Networking Meetup">Networking Meetup</option>
                  <option value="Business Conference">Business Conference</option>
                  <option value="Women Entrepreneurs Forum">Women Entrepreneurs Forum</option>
                  <option value="Startup Event">Startup Event</option>
                  <option value="Industry Meetup">Industry Meetup</option>
                  <option value="Government-Industry Interaction">Government-Industry Interaction</option>
                </select>
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" className="form-control" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Venue Address *</label>
                <input type="text" className="form-control" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Max Attendees *</label>
                <input type="number" className="form-control" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Registration Deadline *</label>
                <input type="date" className="form-control" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label>Event Description *</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish Event</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
