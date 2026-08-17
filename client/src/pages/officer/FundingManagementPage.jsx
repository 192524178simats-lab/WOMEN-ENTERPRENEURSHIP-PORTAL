import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Banknote, Plus, Edit, Archive } from 'lucide-react';

export const FundingManagementPage = () => {
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    provider: 'National Clean Energy & Climate Fund',
    description: '',
    funding_type: 'Government Grant',
    min_amount: '200000',
    max_amount: '1500000',
    interest_rate: '0',
    eligibility: 'Verified women owned business',
    deadline: '2026-11-30',
    required_docs: 'Balance sheets, Pitch deck',
    status: 'Active'
  });

  const { addToast } = useToast();

  const fetchFunding = async () => {
    try {
      const res = await fetch('/api/funding?status=All');
      const data = await res.json();
      setFunding(data);
    } catch (err) {
      console.error('Failed to fetch funding opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, []);

  const openCreateModal = () => {
    setEditItem(null);
    setFormData({
      name: '',
      provider: 'Ministry of MSME Capital Board',
      description: '',
      funding_type: 'Government Grant',
      min_amount: '200000',
      max_amount: '1500000',
      interest_rate: '0',
      eligibility: 'Verified women owned business with >51% equity.',
      deadline: '2026-11-30',
      required_docs: 'Udyam Registration, Bank Statements',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '',
      provider: item.provider || '',
      description: item.description || '',
      funding_type: item.funding_type || 'Government Grant',
      min_amount: item.min_amount || '0',
      max_amount: item.max_amount || '0',
      interest_rate: item.interest_rate || '0',
      eligibility: item.eligibility || '',
      deadline: item.deadline || '',
      required_docs: item.required_docs || '',
      status: item.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editItem ? `/api/funding/${editItem.id}` : '/api/funding';
      const method = editItem ? 'PUT' : 'POST';

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
        addToast('success', data.message || 'Funding opportunity saved!');
        setModalOpen(false);
        fetchFunding();
      } else {
        addToast('error', data.error || 'Failed to save opportunity.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Funding Opportunities Management</h1>
          <p style={{ color: '#64748b' }}>Publish grants, subsidies, seed capital, and micro-loan programs</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Publish New Funding Opportunity
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading funding opportunities...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Funding Name & Provider</th>
                <th>Funding Type</th>
                <th>Amount Range</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {funding.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: '800', color: '#0d9488' }}>{f.funding_code}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{f.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.provider}</div>
                  </td>
                  <td><span className="badge badge-info">{f.funding_type}</span></td>
                  <td style={{ fontWeight: '800', color: '#059669' }}>
                    ₹{f.min_amount?.toLocaleString()} - ₹{f.max_amount?.toLocaleString()}
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{f.deadline}</td>
                  <td><StatusBadge status={f.status} /></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEditModal(f)}>
                      <Edit size={14} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Funding Opportunity' : 'Publish Funding Opportunity'}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Opportunity Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Provider Agency *</label>
                <input type="text" className="form-control" value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Funding Type *</label>
                <select className="form-control" value={formData.funding_type} onChange={(e) => setFormData({ ...formData, funding_type: e.target.value })}>
                  <option value="Government Grant">Government Grant</option>
                  <option value="Subsidy">Subsidy</option>
                  <option value="Loan">Loan</option>
                  <option value="Startup Funding">Startup Funding</option>
                  <option value="Business Development Assistance">Business Development Assistance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Minimum Amount (₹)</label>
                <input type="number" className="form-control" value={formData.min_amount} onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Maximum Amount (₹)</label>
                <input type="number" className="form-control" value={formData.max_amount} onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Interest Rate (% if loan)</label>
                <input type="number" step="0.1" className="form-control" value={formData.interest_rate} onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Application Deadline *</label>
                <input type="date" className="form-control" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>

            <div className="form-group">
              <label>Eligibility Criteria</label>
              <textarea className="form-control" rows="2" value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Opportunity</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
