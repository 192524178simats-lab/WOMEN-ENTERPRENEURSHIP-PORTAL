import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { Users, CalendarDays, CheckCircle2, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MentorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/reports/dashboard-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch mentor stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Mentor Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #be185d 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#fbcfe8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          CERTIFIED MENTOR WORKSPACE
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
          Welcome, {user?.full_name}!
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '4px' }}>
          Guide women-owned businesses through capital fundraising, digital growth, and scale-up strategies.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="card-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={Users} value={stats?.totalRequests || 0} label="Total Requests Received" color="#0284c7" bg="#e0f2fe" />
        <StatCard icon={Clock} value={stats?.pendingRequests || 0} label="Pending Requests" color="#b45309" bg="#fef3c7" />
        <StatCard icon={CheckCircle2} value={stats?.acceptedRequests || 0} label="Accepted Mentorships" color="#15803d" bg="#dcfce7" />
        <StatCard icon={CalendarDays} value={stats?.upcomingSessions || 0} label="Upcoming Virtual Sessions" color="#be185d" bg="#fce7f3" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Review Mentorship Requests</h3>
            <Clock color="#b45309" />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Review incoming requests from female founders and accept or reject based on your expertise.
          </p>
          <Link to="/mentor/requests" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            View Pending Queue <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Mentoring Sessions & Feedback</h3>
            <CalendarDays color="#be185d" />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Launch virtual meeting links, record advisory session notes, and submit feedback.
          </p>
          <Link to="/mentor/sessions" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            Manage Sessions & Feedback <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
