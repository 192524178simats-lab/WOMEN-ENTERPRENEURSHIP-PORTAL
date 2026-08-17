import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { DocumentViewerModal } from '../../components/DocumentViewerModal';
import { useToast } from '../../context/ToastContext';
import { FileCheck2, Clock, CheckCircle2, XCircle, AlertCircle, FileText, Ban } from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [docModal, setDocModal] = useState({ open: false, title: '', url: '' });

  const { addToast } = useToast();

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/funding/my-applications/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await fetch(`/api/funding/applications/${id}/withdraw`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('info', 'Application withdrawn.');
        fetchApplications();
      } else {
        addToast('error', data.error || 'Failed to withdraw application.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  // Helper for tracking timeline status
  const getStepState = (appStatus, step) => {
    if (appStatus === 'Rejected') {
      if (step === 'Submitted' || step === 'Under Review') return 'completed';
      if (step === 'Decision') return 'rejected';
      return 'inactive';
    }

    if (appStatus === 'Withdrawn') {
      if (step === 'Submitted') return 'completed';
      return 'inactive';
    }

    if (appStatus === 'Submitted') {
      if (step === 'Submitted') return 'active';
      return 'inactive';
    }

    if (appStatus === 'Under Review' || appStatus === 'Additional Info Required') {
      if (step === 'Submitted') return 'completed';
      if (step === 'Under Review') return 'active';
      return 'inactive';
    }

    if (appStatus === 'Approved') {
      return 'completed';
    }

    return 'inactive';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>My Funding Applications</h1>
        <p style={{ color: '#64748b' }}>Track real-time status, officer remarks, and document verification timeline</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>No funding applications submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
              <div className="card-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0d9488' }}>{app.application_no}</span>
                  <h3 className="card-title" style={{ fontSize: '1.25rem', marginTop: '2px' }}>{app.funding_name}</h3>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {/* Visual Application Tracking Timeline */}
              <div style={{
                background: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Application Progress Tracking
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                  {/* Connecting Progress Bar */}
                  <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: '#cbd5e1', zIndex: 1 }}></div>

                  {/* Step 1: Submitted */}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: getStepState(app.status, 'Submitted') === 'completed' || getStepState(app.status, 'Submitted') === 'active' ? '#0d9488' : '#e2e8f0',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px',
                      fontWeight: '800'
                    }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Submitted</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(app.created_at).toLocaleDateString()}</div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: getStepState(app.status, 'Under Review') === 'completed' ? '#0d9488' : getStepState(app.status, 'Under Review') === 'active' ? '#0284c7' : '#e2e8f0',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px',
                      fontWeight: '800'
                    }}>
                      <Clock size={20} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Under Officer Review</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Technical Audit</div>
                  </div>

                  {/* Step 3: Sanction Decision */}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: app.status === 'Approved' ? '#15803d' : app.status === 'Rejected' ? '#ef4444' : '#e2e8f0',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px',
                      fontWeight: '800'
                    }}>
                      {app.status === 'Approved' ? <CheckCircle2 size={20} /> : app.status === 'Rejected' ? <XCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: app.status === 'Approved' ? '#15803d' : app.status === 'Rejected' ? '#ef4444' : '#0f172a' }}>
                      {app.status === 'Approved' ? 'Grant Sanctioned' : app.status === 'Rejected' ? 'Application Rejected' : 'Final Sanction'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {app.status === 'Approved' || app.status === 'Rejected' ? 'Evaluation Complete' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: '#64748b' }}>Requested Amount:</strong>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>₹{app.requested_amount?.toLocaleString()}</div>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Business Profile:</strong>
                  <div>{app.business_name} ({app.sector})</div>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Submission Date:</strong>
                  <div>{new Date(app.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Officer Evaluation Remarks */}
              {app.officer_remarks && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Government Officer Evaluation Remarks:</strong> "{app.officer_remarks}"
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setDocModal({ open: true, title: `${app.application_no} - Business Plan Summary`, url: app.business_plan })}
                >
                  <FileText size={14} /> View Document Payload
                </button>

                {app.status === 'Submitted' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleWithdraw(app.id)}>
                    <Ban size={14} /> Withdraw Application
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {docModal.open && (
        <DocumentViewerModal
          isOpen={docModal.open}
          onClose={() => setDocModal({ open: false, title: '', url: '' })}
          title={docModal.title}
          documentUrl={docModal.url}
        />
      )}
    </div>
  );
};
