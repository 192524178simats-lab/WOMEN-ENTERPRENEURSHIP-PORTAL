import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { FileSpreadsheet, Plus, Edit, Archive } from 'lucide-react';

export const SchemeManagementPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editScheme, setEditScheme] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    department: 'Ministry of MSME',
    description: '',
    eligibility: '',
    benefits: '',
    min_funding: '100000',
    max_funding: '1000000',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '2026-12-31',
    required_docs: 'Udyam Registration, Bank Passbook, GST Certificate',
    target_sector: 'All MSME Sectors',
    target_category: 'Women Entrepreneurs',
    guidelines_url: '',
    status: 'Active'
  });

  const { addToast } = useToast();

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes?status=All');
      const data = await res.json();
      setSchemes(data);
    } catch (err) {
      console.error('Failed to fetch schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const openCreateModal = () => {
    setEditScheme(null);
    setFormData({
      name: '',
      department: 'Ministry of MSME',
      description: '',
      eligibility: 'Women owned businesses with >51% shareholding.',
      benefits: 'Capital grant subsidy + interest subvention.',
      min_funding: '100000',
      max_funding: '1000000',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '2026-12-31',
      required_docs: 'Udyam Registration, Bank Passbook, GST Certificate',
      target_sector: 'All MSME Sectors',
      target_category: 'Women Entrepreneurs',
      guidelines_url: '',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const openEditModal = (scheme) => {
    setEditScheme(scheme);
    setFormData({
      name: scheme.name || '',
      department: scheme.department || 'Ministry of MSME',
      description: scheme.description || '',
      eligibility: scheme.eligibility || '',
      benefits: scheme.benefits || '',
      min_funding: scheme.min_funding || '0',
      max_funding: scheme.max_funding || '0',
      start_date: scheme.start_date || '',
      end_date: scheme.end_date || '',
      required_docs: scheme.required_docs || '',
      target_sector: scheme.target_sector || 'All MSME Sectors',
      target_category: scheme.target_category || '',
      guidelines_url: scheme.guidelines_url || '',
      status: scheme.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editScheme ? `/api/schemes/${editScheme.id}` : '/api/schemes';
      const method = editScheme ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Scheme saved successfully!');
        setModalOpen(false);
        fetchSchemes();
      } else {
        addToast('error', data.error || 'Failed to save scheme.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Archive this government scheme?')) return;
    try {
      const res = await fetch(`/api/schemes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      if (res.ok) {
        addToast('info', 'Scheme archived.');
        fetchSchemes();
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Government Schemes Management</h1>
          <p style={{ color: '#64748b' }}>Create, update, publish, or deactivate national entrepreneur support schemes</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Create New Government Scheme
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading schemes...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Scheme Name & Department</th>
                <th>Target Sector</th>
                <th>Max Funding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '800', color: '#0d9488' }}>{s.scheme_code}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.department}</div>
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{s.target_sector}</td>
                  <td style={{ fontWeight: '800', color: '#059669' }}>₹{s.max_funding?.toLocaleString()}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEditModal(s)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleArchive(s.id)}>
                        <Archive size={14} /> Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Scheme Form Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editScheme ? 'Edit Government Scheme' : 'Create Government Scheme'}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Scheme Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input type="text" className="form-control" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Target Business Sector</label>
                <input type="text" className="form-control" value={formData.target_sector} onChange={(e) => setFormData({ ...formData, target_sector: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Minimum Funding (₹)</label>
                <input type="number" className="form-control" value={formData.min_funding} onChange={(e) => setFormData({ ...formData, min_funding: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Maximum Funding (₹)</label>
                <input type="number" className="form-control" value={formData.max_funding} onChange={(e) => setFormData({ ...formData, max_funding: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Application Start Date</label>
                <input type="date" className="form-control" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Application End Date</label>
                <input type="date" className="form-control" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Description & Scope *</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>

            <div className="form-group">
              <label>Eligibility Criteria</label>
              <textarea className="form-control" rows="2" value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}></textarea>
            </div>

            <div className="form-group">
              <label>Benefits & Assistance</label>
              <textarea className="form-control" rows="2" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Scheme</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
