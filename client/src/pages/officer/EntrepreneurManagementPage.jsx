import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { DocumentViewerModal } from '../../components/DocumentViewerModal';
import { useToast } from '../../context/ToastContext';
import { Users, CheckCircle, XCircle, FileText, Building2 } from 'lucide-react';

export const EntrepreneurManagementPage = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');

  const [selectedEnt, setSelectedEnt] = useState(null);
  const [actionType, setActionType] = useState(null); // 'Verify' or 'Reject'
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [docModal, setDocModal] = useState({ open: false, title: '', url: '' });

  const { addToast } = useToast();

  const fetchEntrepreneurs = async () => {
    try {
      let url = `/api/entrepreneurs?search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'All') url += `&status=${encodeURIComponent(statusFilter)}`;
      if (sectorFilter !== 'All') url += `&sector=${encodeURIComponent(sectorFilter)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setEntrepreneurs(data);
    } catch (err) {
      console.error('Failed to fetch entrepreneurs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, [search, statusFilter, sectorFilter]);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const newStatus = actionType === 'Verify' ? 'Verified' : 'Rejected';

    if (newStatus === 'Rejected' && (!remarks || remarks.trim().length === 0)) {
      addToast('warning', 'A rejection reason is strictly required when rejecting business verification.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/entrepreneurs/business/${selectedEnt.business_id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          officer_remarks: remarks
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || `Entrepreneur business ${newStatus.toLowerCase()}!`);
        setSelectedEnt(null);
        setRemarks('');
        fetchEntrepreneurs();
      } else {
        addToast('error', data.error || 'Failed to update verification status.');
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
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Entrepreneur & Business Verification</h1>
        <p style={{ color: '#64748b' }}>Audit registered female founders, inspect Udyam registration credentials, and issue government verification badges</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'status',
            label: 'Verification Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'Pending Verification', label: 'Pending Verification' },
              { value: 'Verified', label: 'Verified' },
              { value: 'Rejected', label: 'Rejected' }
            ]
          },
          {
            key: 'sector',
            label: 'Sector',
            value: sectorFilter,
            onChange: setSectorFilter,
            options: [
              { value: 'Textiles & Handicrafts', label: 'Textiles & Handicrafts' },
              { value: 'Biotechnology & Healthcare', label: 'Biotechnology & Healthcare' },
              { value: 'Agriculture & Food Processing', label: 'Agriculture & Food Processing' },
              { value: 'Technology & CleanTech', label: 'Technology & CleanTech' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setStatusFilter('All'); setSectorFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading registered entrepreneurs...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Founder Name</th>
                <th>Business Name & Udyam Reg</th>
                <th>Sector</th>
                <th>Turnover & Employees</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entrepreneurs.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{e.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.email} | {e.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{e.business_name || 'No Business Profile'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#0d9488' }}>{e.reg_number || 'N/A'}</div>
                  </td>
                  <td><span className="badge badge-info">{e.sector || 'Unassigned'}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>Turnover: ₹{e.annual_turnover?.toLocaleString() || 0}</div>
                    <div style={{ color: '#64748b' }}>{e.employees || 1} Employees</div>
                  </td>
                  <td><StatusBadge status={e.business_status || 'Pending'} /></td>
                  <td>
                    {e.business_id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedEnt(e);
                            setActionType('Verify');
                            setRemarks('');
                          }}
                        >
                          <CheckCircle size={14} /> Verify
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSelectedEnt(e);
                            setActionType('Reject');
                            setRemarks('');
                          }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Profile Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Verification Modal */}
      {selectedEnt && (
        <Modal
          isOpen={!!selectedEnt}
          onClose={() => setSelectedEnt(null)}
          title={`${actionType} Business: ${selectedEnt.business_name}`}
        >
          <form onSubmit={handleVerificationSubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Entrepreneur:</strong> {selectedEnt.full_name} ({selectedEnt.email})</div>
              <div><strong>Udyam Reg Number:</strong> {selectedEnt.reg_number}</div>
              <div><strong>Sector:</strong> {selectedEnt.sector}</div>
              <div><strong>Annual Turnover:</strong> ₹{selectedEnt.annual_turnover?.toLocaleString()}</div>
            </div>

            <div className="form-group">
              <label>
                Officer Evaluation Remarks {actionType === 'Reject' && <span style={{ color: '#ef4444' }}>* (Strictly Required for Rejection)</span>}
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder={actionType === 'Reject' ? 'Provide explicit rejection reason (e.g. Udyam Registration number mismatch or incomplete GST document)...' : 'Enter evaluation remarks or approval notes...'}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required={actionType === 'Reject'}
              ></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedEnt(null)}>Cancel</button>
              <button
                type="submit"
                className={`btn ${actionType === 'Verify' ? 'btn-primary' : 'btn-danger'}`}
                disabled={submitting}
              >
                {actionType === 'Verify' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {submitting ? 'Processing...' : `Confirm ${actionType}`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
