import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Plus, Edit } from 'lucide-react';

export const TrainingManagementPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    trainer: '',
    category: 'Financial Literacy',
    description: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '13:00',
    location: 'Online (Zoom)',
    mode: 'Online',
    max_participants: '50',
    deadline: '2026-11-30',
    eligibility: 'Open to all registered female founders',
    status: 'Upcoming'
  });

  const { addToast } = useToast();

  const fetchTrainings = async () => {
    try {
      const res = await fetch('/api/training?status=All');
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      console.error('Failed to fetch training programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const openCreateModal = () => {
    setEditItem(null);
    setFormData({
      name: '',
      trainer: 'MSME Master Trainer',
      category: 'Financial Literacy',
      description: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '10:00',
      end_time: '13:00',
      location: 'Online (Zoom Webinar)',
      mode: 'Online',
      max_participants: '100',
      deadline: '2026-11-30',
      eligibility: 'Open to all female founders',
      status: 'Upcoming'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editItem ? `/api/training/${editItem.id}` : '/api/training';
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
        addToast('success', data.message || 'Training program saved!');
        setModalOpen(false);
        fetchTrainings();
      } else {
        addToast('error', data.error || 'Failed to save training program.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Training Program Management</h1>
          <p style={{ color: '#64748b' }}>Create, update, and monitor capacity for business workshops</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Create New Training Program
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading programs...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Program Name & Trainer</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Participants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: '800', color: '#0d9488' }}>{t.program_code}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trainer: {t.trainer}</div>
                  </td>
                  <td><span className="badge badge-info">{t.category}</span></td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{t.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.start_time} - {t.end_time} ({t.mode})</div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#0d9488' }}>
                    {t.current_participants} / {t.max_participants} Enrolled
                  </td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Training Program">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Program Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Trainer / Faculty *</label>
                <input type="text" className="form-control" value={formData.trainer} onChange={(e) => setFormData({ ...formData, trainer: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Business Management">Business Management</option>
                  <option value="Financial Literacy">Financial Literacy</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Technology">Technology</option>
                  <option value="Export Management">Export Management</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" className="form-control" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select className="form-control" value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div className="form-group">
                <label>Max Participants Limit *</label>
                <input type="number" className="form-control" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Registration Deadline *</label>
                <input type="date" className="form-control" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description & Learning Objectives *</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish Program</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
