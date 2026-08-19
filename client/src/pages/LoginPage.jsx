import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { DemoToolbar } from '../components/DemoToolbar';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        addToast('success', `Welcome back, ${data.user.full_name}!`);

        // Redirect based on role
        if (data.user.role === 'entrepreneur') navigate('/entrepreneur/dashboard');
        else if (data.user.role === 'officer') navigate('/officer/dashboard');
        else if (data.user.role === 'mentor') navigate('/mentor/dashboard');
        else navigate('/');
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
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
      <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Sparkles size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a' }}>Portal Sign In</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Access your role-specific dashboard</p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#64748b' }}>
            New to the portal? <Link to="/register" style={{ fontWeight: '700' }}>Register your business</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
