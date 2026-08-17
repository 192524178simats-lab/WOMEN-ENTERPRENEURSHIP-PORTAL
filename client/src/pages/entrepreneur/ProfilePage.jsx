import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, profileData, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    education: ''
  });

  useEffect(() => {
    if (user && profileData) {
      const ent = profileData.entrepreneur || {};
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        dob: ent.dob || '',
        address: ent.address || '',
        city: ent.city || '',
        state: ent.state || '',
        education: ent.education || ''
      });
    }
  }, [user, profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/entrepreneurs/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', 'Personal profile updated successfully!');
        refreshProfile();
      } else {
        addToast('error', data.error || 'Failed to update profile.');
      }
    } catch (err) {
      addToast('error', 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Entrepreneur Profile</h1>
        <p style={{ color: '#64748b' }}>Manage your personal details and contact information</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address (Account ID)</label>
              <input type="email" className="form-control" value={user?.email || ''} disabled style={{ background: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Highest Education Qualification</label>
              <input type="text" name="education" className="form-control" value={formData.education} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Residential Address</label>
              <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
