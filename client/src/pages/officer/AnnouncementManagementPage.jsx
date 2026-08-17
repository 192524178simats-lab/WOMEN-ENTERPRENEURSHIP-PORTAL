import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Megaphone, Plus, Archive } from 'lucide-react';

export const AnnouncementManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Funding',
    expiry_date: '2026-12-31',
    status: 'Active'
  });

  const { addToast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements?status=All');
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Announcement published!');
        setModalOpen(false);
        fetchAnnouncements();
      } else {
        addToast('error', data.error || 'Failed to publish announcement.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Archive this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      if (res.ok) {
        addToast('info', 'Announcement archived.');
        fetchAnnouncements();
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Announcement Management</h1>
          <p style={{ color: '#64748b' }}>Publish public policy releases, grant alerts, and ministry notices</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Publish New Announcement
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading announcements...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Expiry Date</th>
                <th>Publisher</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{a.title}</td>
                  <td><span className="badge badge-info">{a.category}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{a.published_date}</td>
                  <td style={{ fontSize: '0.85rem' }}>{a.expiry_date}</td>
                  <td style={{ fontSize: '0.85rem' }}>{a.publisher || 'Officer'}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    {a.status === 'Active' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleArchive(a.id)}>
                        <Archive size={14} /> Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Publish Announcement">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Announcement Title *</label>
              <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Funding">Funding</option>
                  <option value="Government Scheme">Government Scheme</option>
                  <option value="Training">Training</option>
                  <option value="Networking">Networking</option>
                  <option value="Policy">Policy</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" className="form-control" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Detailed Announcement Text *</label>
              <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
