import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Banknote,
  GraduationCap,
  Users,
  Radio,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2
} from 'lucide-react';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalEntrepreneurs: 240,
    totalSchemes: 15,
    totalFunding: 12,
    totalTraining: 8,
    totalMentors: 25,
    totalEvents: 6
  });

  useEffect(() => {
    fetch('/api/reports/public-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch((err) => console.error('Failed to fetch public landing stats:', err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)',
        color: '#ffffff',
        padding: '5rem 2rem',
        borderRadius: '0 0 24px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(13, 148, 136, 0.2)',
            border: '1px solid rgba(13, 148, 136, 0.4)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#5eead4',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={16} /> Centralized Government Initiative – SDG 5
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: '900', color: '#ffffff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Empowering Women Entrepreneurs Through Digital Access
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
            Discover government schemes, funding opportunities, training programs, mentors, and networking opportunities — all in one place.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/public-schemes" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: '700' }}>
              Explore Opportunities <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: '700', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              Register as Entrepreneur
            </Link>
          </div>
        </div>
      </section>

      {/* Real Live Database Statistics Section */}
      <section style={{ maxWidth: '1200px', margin: '-2.5rem auto 4rem', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0d9488' }}>{stats.totalEntrepreneurs}+</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Registered Entrepreneurs</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0284c7' }}>{stats.totalSchemes}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Available Schemes</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#059669' }}>{stats.totalFunding}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Funding Opportunities</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#b45309' }}>{stats.totalTraining}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Training Programs</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#be185d' }}>{stats.totalMentors}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Certified Mentors</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800' }}>Comprehensive Support Ecosystem</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '4px' }}>Everything a female founder needs to start, fund, and scale her enterprise</p>
        </div>

        <div className="card-grid">
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#ccfbf1', color: '#0d9488', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Government Schemes</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Centralized access to MSME subsidies, capital grants, collateral-free credit, and technology upgrade schemes.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Banknote size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Funding Support</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Apply for government grants, soft loans, interest subvention, and venture seed capital directly online.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#fef3c7', color: '#b45309', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <GraduationCap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Business Training</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Participate in capacity building workshops covering financial literacy, e-commerce, export trade, and digital marketing.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#fce7f3', color: '#be185d', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Expert Mentoring</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Connect 1-on-1 with industry leaders, financial advisors, and experienced entrepreneurs for strategic guidance.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Radio size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Networking</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Attend national founder summits, regional conventions, and buyer-seller meets to grow your business network.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ background: '#f1f5f9', color: '#475569', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileCheck2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.5rem' }}>Application Tracking</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Track funding application status in real-time with full officer evaluation transparency and remarks.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ background: '#f8fafc', padding: '4rem 1.5rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800' }}>How It Works</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '4px' }}>Five simple steps to accelerate your business growth</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '1', title: 'Register', desc: 'Create your free account as a female founder' },
              { num: '2', title: 'Create Business Profile', desc: 'Add Udyam reg number, sector & turnover details' },
              { num: '3', title: 'Discover Opportunities', desc: 'Filter schemes, grants, and training programs' },
              { num: '4', title: 'Apply & Participate', desc: 'Submit funding applications & attend mentorship sessions' },
              { num: '5', title: 'Grow Your Business', desc: 'Receive government grants and scale your enterprise' }
            ].map((step, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.5rem', background: '#ffffff' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.4rem' }}>{step.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '4rem 2rem',
          boxShadow: '0 15px 30px rgba(13, 148, 136, 0.2)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#ffffff' }}>
            Start Your Entrepreneurial Journey Today
          </h2>
          <p style={{ color: '#ccfbf1', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 2rem' }}>
            Join thousands of women entrepreneurs accessing government funding, mentorship, and business support across India.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', fontWeight: '700', background: '#ffffff', color: '#0d9488' }}>
            Register Now – Free Access <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
