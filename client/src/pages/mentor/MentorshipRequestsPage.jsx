import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Users, CheckCircle, XCircle, Calendar, Video } from 'lucide-react';

export const MentorshipRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/mentors/requests/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch mentor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (status) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/mentors/requests/${selectedReq.id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          status,
          meeting_link: meetingLink || `https://meet.jit.si/wep-mentorship-${selectedReq.id}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || `Request ${status.toLowerCase()}.`);
        setSelectedReq(null);
        fetchRequests();
      } else {
        addToast('error', data.error || 'Failed to respond.');
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
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Mentorship Request Queue</h1>
        <p style={{ color: '#64748b' }}>Review requests sent by female entrepreneurs and schedule virtual sessions</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No mentorship requests in queue.</p>
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="card-header">
                <span className="badge badge-info">{r.sector}</span>
                <StatusBadge status={r.status} />
              </div>

              <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                {r.entrepreneur_name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '700', marginBottom: '0.75rem' }}>
                Business: {r.business_name}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontStyle: 'italic' }}>
                "{r.reason}"
              </p>

              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1rem' }}>
                <strong>Requested Slot:</strong> {r.preferred_date} at {r.preferred_time}
              </div>

              {r.status === 'Pending' && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setSelectedReq(r);
                    setMeetingLink(`https://meet.jit.si/wep-mentorship-${r.id}`);
                  }}
                >
                  <Users size={16} /> Respond to Request
                </button>
              )}

              {r.status === 'Accepted' && r.meeting_link && (
                <div style={{ marginTop: '0.5rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#15803d' }}>
                  Session Scheduled for {r.session_date || r.preferred_date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedReq && (
        <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title={`Respond to ${selectedReq.entrepreneur_name}`}>
          <div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Business:</strong> {selectedReq.business_name} ({selectedReq.sector})</div>
              <div><strong>Reason:</strong> {selectedReq.reason}</div>
              <div><strong>Requested Date & Time:</strong> {selectedReq.preferred_date} at {selectedReq.preferred_time}</div>
            </div>

            <div className="form-group">
              <label>Virtual Meeting Link (Zoom / Jitsi / Teams)</label>
              <input
                type="text"
                className="form-control"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.jit.si/wep-mentorship-session"
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn btn-danger"
                disabled={submitting}
                onClick={() => handleRespond('Rejected')}
              >
                <XCircle size={16} /> Reject Request
              </button>
              <button
                className="btn btn-primary"
                disabled={submitting}
                onClick={() => handleRespond('Accepted')}
              >
                <CheckCircle size={16} /> Accept & Schedule Session
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
