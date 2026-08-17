import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Users, Calendar, Video, CheckCircle, MessageSquare } from 'lucide-react';

export const MyMentorshipRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/mentors/requests/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch mentorship requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>My Mentorship Requests & Sessions</h1>
        <p style={{ color: '#64748b' }}>Track mentorship status, virtual meeting links, and mentor advice</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading mentorship requests...</div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#0f172a' }}>No Mentorship Requests</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            You have not requested mentorship from any advisors yet.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="card-header">
                <span className="badge badge-info">{r.industry}</span>
                <StatusBadge status={r.status} />
              </div>

              <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                Mentor: {r.mentor_name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '700', marginBottom: '0.75rem' }}>
                Expertise: {r.expertise}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', fontStyle: 'italic', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                "{r.reason}"
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Requested Date:</strong> {r.preferred_date} at {r.preferred_time}</div>
              </div>

              {/* Scheduled Session Card if accepted */}
              {r.status === 'Accepted' && r.meeting_link && (
                <div style={{ marginTop: '1rem', background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '700', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Video size={16} /> Virtual Session Scheduled
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', marginBottom: '8px' }}>
                    Meeting Time: {r.session_date || r.preferred_date} at {r.session_time || r.preferred_time}
                  </div>
                  <a
                    href={r.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Join Video Session
                  </a>
                </div>
              )}

              {/* Session Feedback if completed */}
              {r.feedback && (
                <div style={{ marginTop: '1rem', background: '#eff6ff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: '700', color: '#1e40af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={14} /> Mentor Notes & Feedback:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#1e3a8a', marginTop: '4px' }}>
                    "{r.feedback}"
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
