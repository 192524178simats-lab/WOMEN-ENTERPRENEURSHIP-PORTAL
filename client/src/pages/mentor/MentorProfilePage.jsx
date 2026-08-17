import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Save, User, Award } from 'lucide-react';

export const MentorProfilePage = () => {
  const { user, profileData, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    professional_bg: '',
    industry: 'Finance & Venture Capital',
    expertise: 'Financial Management',
    years_experience: '10',
    qualifications: '',
    bio: '',
    availability: 'Mon & Thu (4:00 PM - 7:00 PM)'
  });

  const mentor = profileData?.mentor;

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        professional_bg: mentor?.professional_bg || '',
        industry: mentor?.industry || 'Finance & Venture Capital',
        expertise: mentor?.expertise || 'Financial Management',
        years_experience: mentor?.years_experience || '10',
        qualifications: mentor?.qualifications || '',
        bio: mentor?.bio || '',
        availability: mentor?.availability || 'Mon & Thu (4:00 PM - 7:00 PM)'
      });
    }
  }, [user, mentor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/mentors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Mentor profile updated!');
        refreshProfile();
      } else {
        addToast('error', data.error || 'Failed to update profile.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Mentor Profile & Availability</h1>
        <p style={{ color: '#64748b' }}>Update your professional background, domain expertise, and mentoring slots</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Professional Title / Organization</label>
              <input type="text" name="professional_bg" className="form-control" value={formData.professional_bg} onChange={handleChange} placeholder="Senior Partner at Venture Horizon" />
            </div>
            <div className="form-group">
              <label>Industry Sector</label>
              <select name="industry" className="form-control" value={formData.industry} onChange={handleChange}>
                <option value="Finance & Venture Capital">Finance & Venture Capital</option>
                <option value="Digital Marketing & E-Commerce">Digital Marketing & E-Commerce</option>
                <option value="Export Management & Manufacturing">Export Management & Manufacturing</option>
                <option value="General Business">General Business Strategy</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specific Core Expertise</label>
              <input type="text" name="expertise" className="form-control" value={formData.expertise} onChange={handleChange} placeholder="Debt & Equity Fundraising, Scale-up" />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" name="years_experience" className="form-control" value={formData.years_experience} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Qualifications & Degrees</label>
              <input type="text" name="qualifications" className="form-control" value={formData.qualifications} onChange={handleChange} placeholder="Ph.D. in Finance, IIM Alumna" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Availability Days & Time Slots</label>
              <input type="text" name="availability" className="form-control" value={formData.availability} onChange={handleChange} placeholder="Mon & Thu (4:00 PM - 7:00 PM)" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Professional Biography</label>
              <textarea name="bio" className="form-control" rows="4" value={formData.bio} onChange={handleChange} placeholder="Summary of your startup advisory track record..."></textarea>
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
