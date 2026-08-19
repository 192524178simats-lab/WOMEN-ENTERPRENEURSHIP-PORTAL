import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Building2, User, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { DemoToolbar } from '../components/DemoToolbar';

export const RegisterPage = () => {
  const [role, setRole] = useState('entrepreneur');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    education: '',
    // Business fields
    business_name: '',
    business_type: 'Private Limited',
    sector: 'Textiles & Handicrafts',
    reg_number: '',
    start_date: '',
    employees: '10',
    annual_turnover: '2500000',
    description: '',
    website: '',
    social_links: '',
    // Mentor fields
    professional_bg: '',
    industry: 'Finance & Capital',
    expertise: 'Financial Planning',
    years_experience: '10',
    qualifications: '',
    bio: '',
    availability: 'Mon & Wed'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Please fill in all mandatory fields (Full Name, Email, Password).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        addToast('success', 'Registration successful! Welcome to the portal.');
        if (role === 'entrepreneur') navigate('/entrepreneur/dashboard');
        else if (role === 'mentor') navigate('/mentor/dashboard');
        else navigate('/');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error: Unable to connect to backend server. Please ensure the Express server is running on http://localhost:5000 (run `npm start`).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DemoToolbar />
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Sparkles size={24} />
            </div>
            <h2 style={{ fontSize: '1.85rem', color: '#0f172a' }}>Portal Account Registration</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Join the Women Entrepreneurship Support Platform (SDG 5)
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              type="button"
              className={`btn ${role === 'entrepreneur' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.85rem' }}
              onClick={() => setRole('entrepreneur')}
            >
              👩‍💼 Women Entrepreneur
            </button>
            <button
              type="button"
              className={`btn ${role === 'mentor' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.85rem' }}
              onClick={() => setRole('mentor')}
            >
              🎓 Certified Mentor
            </button>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h4 style={{ color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              1. Personal Information
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="full_name" className="form-control" placeholder="Priya Sharma" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" className="form-control" placeholder="priya@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" className="form-control" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Highest Education</label>
                <input type="text" name="education" className="form-control" placeholder="B.Tech / MBA" value={formData.education} onChange={handleChange} />
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" className="form-control" placeholder="Jaipur / Bengaluru" value={formData.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" className="form-control" placeholder="Rajasthan / Karnataka" value={formData.state} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Full Address</label>
                <input type="text" name="address" className="form-control" placeholder="Street, Industrial Area, Pincode" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            {role === 'entrepreneur' && (
              <>
                <h4 style={{ color: '#0f172a', margin: '2rem 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  2. Business Details
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" name="business_name" className="form-control" placeholder="EcoCraft India" value={formData.business_name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Business Type</label>
                    <select name="business_type" className="form-control" value={formData.business_type} onChange={handleChange}>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="LLP">LLP</option>
                      <option value="Self-Help Group (SHG)">Self-Help Group (SHG)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Business Sector</label>
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
                    <label>Udyam / Reg Number</label>
                    <input type="text" name="reg_number" className="form-control" placeholder="REG-RJ-2024-9981" value={formData.reg_number} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Number of Employees</label>
                    <input type="number" name="employees" className="form-control" value={formData.employees} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Annual Turnover (₹)</label>
                    <input type="number" name="annual_turnover" className="form-control" value={formData.annual_turnover} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Business Description</label>
                  <textarea name="description" className="form-control" rows="3" placeholder="Brief summary of your products, market, and impact..." value={formData.description} onChange={handleChange}></textarea>
                </div>
              </>
            )}

            {role === 'mentor' && (
              <>
                <h4 style={{ color: '#0f172a', margin: '2rem 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  2. Professional Mentor Background
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Professional Title / Background</label>
                    <input type="text" name="professional_bg" className="form-control" placeholder="Ex-VP SIDBI / Senior Venture Partner" value={formData.professional_bg} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Industry Expertise</label>
                    <input type="text" name="industry" className="form-control" placeholder="Finance & Capital / Digital Marketing" value={formData.industry} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input type="number" name="years_experience" className="form-control" value={formData.years_experience} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Availability Slots</label>
                    <input type="text" name="availability" className="form-control" placeholder="Mon & Thu (4:00 PM - 7:00 PM)" value={formData.availability} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            Already registered? <Link to="/login" style={{ fontWeight: '700' }}>Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
