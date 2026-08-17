import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Building2, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const BusinessProfilePage = () => {
  const { profileData, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'Private Limited',
    sector: 'Textiles & Handicrafts',
    reg_number: '',
    start_date: '',
    employees: '1',
    annual_turnover: '0',
    description: '',
    website: '',
    social_links: ''
  });

  const business = profileData?.business;

  useEffect(() => {
    if (business) {
      setFormData({
        business_name: business.business_name || '',
        business_type: business.business_type || 'Private Limited',
        sector: business.sector || 'Textiles & Handicrafts',
        reg_number: business.reg_number || '',
        start_date: business.start_date || '',
        employees: business.employees || '1',
        annual_turnover: business.annual_turnover || '0',
        description: business.description || '',
        website: business.website || '',
        social_links: business.social_links || ''
      });
    }
  }, [business]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/entrepreneurs/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Business profile saved!');
        refreshProfile();
      } else {
        addToast('error', data.error || 'Failed to save business profile.');
      }
    } catch (err) {
      addToast('error', 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Business Profile & Registration</h1>
          <p style={{ color: '#64748b' }}>Manage your MSME enterprise information for government verification</p>
        </div>
        <div style={{ background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>GOVERNMENT STATUS</span>
          <StatusBadge status={business?.status || 'Pending Verification'} />
        </div>
      </div>

      {/* Officer Remarks Banner if present */}
      {business?.officer_remarks && (
        <div style={{
          background: business.status === 'Verified' ? '#f0fdf4' : business.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
          border: `1px solid ${business.status === 'Verified' ? '#bbf7d0' : business.status === 'Rejected' ? '#fca5a5' : '#fde68a'}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={18} color="#0d9488" /> Government Officer Verification Remarks
          </div>
          <p style={{ fontSize: '0.9rem', color: '#334155' }}>{business.officer_remarks}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Business Name *</label>
              <input type="text" name="business_name" className="form-control" value={formData.business_name} onChange={handleChange} required placeholder="EcoCraft India Handicrafts" />
            </div>
            <div className="form-group">
              <label>Business Type *</label>
              <select name="business_type" className="form-control" value={formData.business_type} onChange={handleChange}>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="LLP">LLP</option>
                <option value="Self-Help Group (SHG)">Self-Help Group (SHG)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Industry / Sector *</label>
              <select name="sector" className="form-control" value={formData.sector} onChange={handleChange}>
                <option value="Textiles & Handicrafts">Textiles & Handicrafts</option>
                <option value="Biotechnology & Healthcare">Biotechnology & Healthcare</option>
                <option value="Technology & CleanTech">Technology & CleanTech</option>
                <option value="Agriculture & Food Processing">Agriculture & Food Processing</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Services & Education">Services & Education</option>
              </select>
            </div>
            <div className="form-group">
              <label>Registration / Udyam Number</label>
              <input type="text" name="reg_number" className="form-control" value={formData.reg_number} onChange={handleChange} placeholder="REG-RJ-2024-9981" />
            </div>
            <div className="form-group">
              <label>Establishment Start Date</label>
              <input type="date" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Number of Employees</label>
              <input type="number" name="employees" className="form-control" value={formData.employees} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Annual Turnover (₹)</label>
              <input type="number" name="annual_turnover" className="form-control" value={formData.annual_turnover} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Business Website URL</label>
              <input type="text" name="website" className="form-control" value={formData.website} onChange={handleChange} placeholder="https://mybusiness.com" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Social Media / Portfolio Links</label>
              <input type="text" name="social_links" className="form-control" value={formData.social_links} onChange={handleChange} placeholder="https://linkedin.com/company/mybiz, https://instagram.com/mybiz" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Business Description & Product Overview</label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} placeholder="Describe your core products, services, target audience, and social impact..."></textarea>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Submit Business Profile for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
