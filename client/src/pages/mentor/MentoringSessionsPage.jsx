import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { CalendarDays, Video, CheckCircle, MessageSquare, Send } from 'lucide-react';

export const MentoringSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/mentors/requests/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setSessions(data.filter(r => r.status === 'Accepted' || r.session_id));
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSession?.session_id) {
      addToast('warning', 'Session record not initialized.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/mentors/sessions/${selectedSession.session_id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          feedback,
          status: 'Completed'
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Session completed and feedback recorded!');
        setSelectedSession(null);
        setFeedback('');
        fetchSessions();
      } else {
        addToast('error', data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Mentoring Sessions & Feedback</h1>
        <p style={{ color: '#64748b' }}>Launch virtual meeting rooms, record session outcomes, and provide feedback</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No active mentoring sessions found.</p>
        </div>
      ) : (
        <div className="card-grid">
          {sessions.map((s) => (
            <div key={s.id} className="card">
              <div className="card-header">
                <span className="badge badge-info">{s.sector}</span>
                <StatusBadge status={s.session_status || 'Scheduled'} />
              </div>

              <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                Entrepreneur: {s.entrepreneur_name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '700', marginBottom: '0.75rem' }}>
                Business: {s.business_name}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div><strong>Scheduled Date:</strong> {s.session_date || s.preferred_date}</div>
                <div><strong>Scheduled Time:</strong> {s.session_time || s.preferred_time}</div>
              </div>

              {s.meeting_link && (
                <a
                  href={s.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginBottom: '0.75rem', justifyContent: 'center' }}
                >
                  <Video size={16} /> Launch Virtual Video Room
                </a>
              )}

              {s.feedback ? (
                <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
                  <strong>Feedback Recorded:</strong> "{s.feedback}"
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setSelectedSession(s);
                    setFeedback(s.feedback || '');
                  }}
                >
                  <CheckCircle size={14} /> Complete & Add Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedSession && (
        <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title={`Complete Session for ${selectedSession.entrepreneur_name}`}>
          <form onSubmit={handleFeedbackSubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Business Name:</strong> {selectedSession.business_name}</div>
              <div><strong>Reason:</strong> {selectedSession.reason}</div>
            </div>

            <div className="form-group">
              <label>Mentorship Feedback & Action Items for Entrepreneur *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter financial advice, export preparation steps, or key takeaways discussed during session..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedSession(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Send size={16} /> {submitting ? 'Submitting...' : 'Complete Session & Submit'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
