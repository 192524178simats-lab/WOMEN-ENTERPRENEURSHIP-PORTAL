import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Users, Award, Calendar, Clock, Send, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MentorDirectoryPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Form states for sending request
  const [reason, setReason] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('16:00');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchMentors = async () => {
    try {
      let url = `/api/mentors?search=${encodeURIComponent(search)}&status=Active`;
      if (industryFilter !== 'All') url += `&industry=${encodeURIComponent(industryFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [search, industryFilter]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!reason || !preferredDate || !preferredTime) {
      addToast('warning', 'Please provide reason, preferred date, and preferred time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/mentors/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          mentor_id: selectedMentor.id,
          reason,
          preferred_date: preferredDate,
          preferred_time: preferredTime
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', 'Mentorship request sent successfully!');
        setSelectedMentor(null);
        setReason('');
        navigate('/entrepreneur/mentorship-requests');
      } else {
        addToast('error', data.error || 'Failed to send mentorship request.');
      }
    } catch (err) {
      addToast('error', 'Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Certified Mentor Directory</h1>
          <p style={{ color: '#64748b' }}>Connect with senior advisors, financial strategists, and industry experts</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/entrepreneur/mentorship-requests')}>
          View My Requests & Sessions →
        </button>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'industry',
            label: 'Industry Sector',
            value: industryFilter,
            onChange: setIndustryFilter,
            options: [
              { value: 'Finance & Venture Capital', label: 'Finance & Venture Capital' },
              { value: 'Digital Marketing & E-Commerce', label: 'Digital Marketing & E-Commerce' },
              { value: 'Export Management & Manufacturing', label: 'Export Management' },
              { value: 'General Business', label: 'General Business Strategy' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setIndustryFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading mentor directory...</div>
      ) : mentors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No mentors matched your search filters.</p>
        </div>
      ) : (
        <div className="card-grid">
          {mentors.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={m.profile_photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                    alt={m.full_name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0d9488' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{m.full_name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: '700' }}>{m.years_experience} Years Experience</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.qualifications}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <span className="badge badge-info">{m.industry}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Background: {m.professional_bg}
                </p>

                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.bio}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Availability:</strong> {m.availability}
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedMentor(m)}
                >
                  <Users size={16} /> Request Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Mentorship Request Modal */}
      {selectedMentor && (
        <Modal isOpen={!!selectedMentor} onClose={() => setSelectedMentor(null)} title={`Request Mentorship with ${selectedMentor.full_name}`}>
          <form onSubmit={handleSendRequest}>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', color: '#15803d' }}>
                {selectedMentor.full_name} ({selectedMentor.industry})
              </div>
              <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>
                Expertise: {selectedMentor.expertise}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0d9488', marginTop: '4px' }}>
                Slots: {selectedMentor.availability}
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Mentorship & Specific Business Challenges *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Explain the specific advice you seek (e.g. debt vs equity fundraising, export clearance, D2C performance marketing)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot *</label>
                <input
                  type="time"
                  className="form-control"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedMentor(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Send size={16} /> {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
