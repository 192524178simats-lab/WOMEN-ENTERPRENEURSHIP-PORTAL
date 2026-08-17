import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { DocumentViewerModal } from '../../components/DocumentViewerModal';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { CheckSquare, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const ApplicationManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Approved');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [viewDocs, setViewDocs] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchApplications = async () => {
    try {
      let url = `/api/funding/applications/list?search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'All') url += `&status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url, {
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
  }, [search, statusFilter]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/funding/applications/${selectedApp.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          officer_remarks: officerRemarks
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Application evaluation updated!');
        setSelectedApp(null);
        fetchApplications();
      } else {
        addToast('error', data.error || 'Failed to update application status.');
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
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Funding Application Review Queue</h1>
        <p style={{ color: '#64748b' }}>Evaluate submitted grant applications, review business plans, and issue official approvals or rejections</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'status',
            label: 'Status Queue',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'Submitted', label: 'Submitted (New Queue)' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Additional Information Required', label: 'Info Required' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setStatusFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading funding applications...</div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No funding applications found in review queue.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>App Number</th>
                <th>Applicant Business</th>
                <th>Funding Scheme</th>
                <th>Requested Amount</th>
                <th>Status</th>
                <th>Officer Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                let parsedDocs = [];
                try { parsedDocs = JSON.parse(app.docs_json); } catch (e) { parsedDocs = ['business_plan.pdf']; }

                return (
                  <tr key={app.id}>
                    <td style={{ fontWeight: '800', color: '#0d9488' }}>{app.application_no}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{app.business_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Owner: {app.entrepreneur_name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{app.funding_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.funding_type}</div>
                    </td>
                    <td style={{ fontWeight: '800', color: '#059669' }}>
                      ₹{app.requested_amount?.toLocaleString()}
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>
                        {app.officer_remarks || 'None'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setViewDocs({ appNo: app.application_no, docs: parsedDocs })}
                        >
                          <FileText size={14} /> Docs
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status === 'Submitted' ? 'Under Review' : app.status);
                            setOfficerRemarks(app.officer_remarks || '');
                          }}
                        >
                          Evaluate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Evaluate Application: ${selectedApp.application_no}`}>
          <form onSubmit={handleReviewSubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Applicant Business:</strong> {selectedApp.business_name} ({selectedApp.sector})</div>
              <div><strong>Founder:</strong> {selectedApp.entrepreneur_name} ({selectedApp.entrepreneur_email})</div>
              <div><strong>Funding Opportunity:</strong> {selectedApp.funding_name}</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
                Requested Grant Amount: ₹{selectedApp.requested_amount?.toLocaleString()}
              </div>
              <div style={{ marginTop: '6px' }}><strong>Purpose:</strong> {selectedApp.purpose}</div>
            </div>

            <div className="form-group">
              <label>Decision Status *</label>
              <select className="form-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Approved">Approved (Grant Capital Sanctioned)</option>
                <option value="Under Review">Under Review (Technical Evaluation)</option>
                <option value="Additional Information Required">Additional Information Required</option>
                <option value="Rejected">Rejected (Ineligible / Insufficient Budget)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Officer Evaluation Remarks *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter justification, committee findings, or additional document requirements..."
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {viewDocs && (
        <DocumentViewerModal
          isOpen={!!viewDocs}
          onClose={() => setViewDocs(null)}
          title={`Supporting Documents - ${viewDocs.appNo}`}
          docs={viewDocs.docs}
        />
      )}
    </div>
  );
};
