import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Banknote,
  FileCheck2,
  GraduationCap,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('wep_token');

      const [statsRes, recRes] = await Promise.all([
        fetch('/api/reports/dashboard-stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/entrepreneurs/recommendations', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData);
      }
    } catch (err) {
      console.error('Failed to fetch entrepreneur dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const completion = stats?.profileCompletion || 60;
  const missing = stats?.missingFields || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.3)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#ccfbf1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SDG 5 WOMEN ENTREPRENEUR PORTAL
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
          Welcome back, {user?.full_name}!
        </h1>
        <p style={{ color: '#99f6e4', fontSize: '0.95rem', marginTop: '4px' }}>
          {stats?.business ? `Business: ${stats.business.business_name} (${stats.business.sector})` : 'Register your business profile to access capital funding and schemes'}
        </p>
      </div>

      {/* Profile Completion Indicator */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', borderLeft: '6px solid #0d9488' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#0d9488" /> Profile Completion Meter
          </div>
          <div style={{ fontWeight: '800', color: '#0d9488', fontSize: '1.1rem' }}>{completion}% Completed</div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', background: '#e2e8f0', height: '10px', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ width: `${completion}%`, background: 'linear-gradient(90deg, #0d9488 0%, #059669 100%)', height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
        </div>

        {completion < 100 ? (
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.875rem', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <strong>Complete your profile to access more relevant opportunities:</strong> {missing.join(', ')}
            </div>
            <Link to="/entrepreneur/business" className="btn btn-primary btn-sm" style={{ background: '#b45309', border: 'none' }}>
              Complete Now <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ color: '#166534', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Your profile is 100% complete and fully verified for all government grants!
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="card-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={FileCheck2} value={stats?.activeApps || 0} label="Active Applications" color="#0284c7" bg="#e0f2fe" />
        <StatCard icon={Banknote} value={stats?.approvedApps || 0} label="Approved Grants" color="#15803d" bg="#dcfce7" />
        <StatCard icon={GraduationCap} value={stats?.myTrainings || 0} label="Enrolled Training Workshops" color="#b45309" bg="#fef3c7" />
        <StatCard icon={Users} value={stats?.myMentorships || 0} label="Mentorship Requests" color="#be185d" bg="#fce7f3" />
      </div>

      {/* Opportunity Recommendations Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>Recommended for You</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Matched based on your business sector: <strong style={{ color: '#0d9488' }}>{recommendations?.sector || 'Textiles & Handicrafts'}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Recommended Schemes */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#0d9488', fontWeight: '700' }}>
              <Building2 size={20} /> Recommended Schemes
            </div>
            {recommendations?.schemes?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.schemes.slice(0, 2).map((s) => (
                  <div key={s.id} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #0d9488' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{s.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{s.department}</div>
                  </div>
                ))}
                <Link to="/entrepreneur/schemes" style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                  View All Schemes <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No matched schemes found.</div>
            )}
          </div>

          {/* Recommended Funding */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#15803d', fontWeight: '700' }}>
              <Banknote size={20} /> Recommended Grants & Funding
            </div>
            {recommendations?.funding?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.funding.slice(0, 2).map((f) => (
                  <div key={f.id} style={{ background: '#f0fdf4', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #15803d' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{f.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginTop: '2px' }}>
                      Grant: ₹{f.max_amount?.toLocaleString()}
                    </div>
                  </div>
                ))}
                <Link to="/entrepreneur/funding" style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                  Apply For Funding <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No matched funding grants found.</div>
            )}
          </div>

          {/* Recommended Mentors */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#be185d', fontWeight: '700' }}>
              <Users size={20} /> Recommended Advisors & Mentors
            </div>
            {recommendations?.mentors?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.mentors.slice(0, 2).map((m) => (
                  <div key={m.id} style={{ background: '#fce7f3', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #be185d' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{m.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9d174d', marginTop: '2px' }}>{m.expertise}</div>
                  </div>
                ))}
                <Link to="/entrepreneur/mentors" style={{ fontSize: '0.85rem', color: '#be185d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                  Connect with Mentors <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No matched mentors found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
