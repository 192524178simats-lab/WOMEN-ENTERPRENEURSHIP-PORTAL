import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Building2,
  FileCheck2,
  Banknote,
  GraduationCap,
  Radio,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

export const OfficerDashboard = () => {
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
      console.error('Failed to fetch officer dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#0d9488', '#0284c7', '#15803d', '#b45309', '#be185d', '#64748b'];

  const statusPieData = stats?.appsByStatus?.map(a => ({
    name: a.status,
    value: a.count
  })) || [];

  const sectorBarData = stats?.sectorBreakdown?.map(s => ({
    name: s.sector,
    count: s.count
  })) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Officer Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0d9488 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#99f6e4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          MINISTRY OF MSME & SDG 5 GOVERNANCE
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
          Government Officer Dashboard
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '4px' }}>
          Welcome, {user?.full_name}! Oversee entrepreneur registrations, review funding applications, and manage schemes.
        </p>
      </div>

      {/* Summary Stat Grid */}
      <div className="card-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={Users} value={stats?.totalEntrepreneurs || 0} label="Total Registered Founders" color="#0284c7" bg="#e0f2fe" />
        <StatCard icon={CheckCircle2} value={stats?.verifiedEntrepreneurs || 0} label="Verified Business Profiles" color="#15803d" bg="#dcfce7" />
        <StatCard icon={Clock} value={stats?.pendingApps || 0} label="Pending Applications" color="#b45309" bg="#fef3c7" />
        <StatCard icon={Banknote} value={`₹${((stats?.totalApprovedFunding || 0) / 100000).toFixed(1)}L`} label="Sanctioned Capital Grant" color="#0d9488" bg="#ccfbf1" />
      </div>

      {/* Interactive Visual Recharts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Graph 1: Funding Applications by Status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={20} color="#0d9488" /> Funding Applications Distribution
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Entrepreneurs by Business Sector */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#0284c7" /> Female-Owned Enterprises by Sector
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorBarData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '0.25rem' }}>Pending Verification Queue</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Audit submitted business profiles and issue government verification badges.</p>
          <Link to="/officer/entrepreneurs" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Audit Entrepreneurs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '0.25rem' }}>Application Review Queue</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Evaluate funding applications, sanction grants, or add officer remarks.</p>
          <Link to="/officer/applications" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Review Applications <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '0.25rem' }}>System Reports & Analytics</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Generate filtered query reports and export data to CSV for ministry audits.</p>
          <Link to="/officer/reports" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            Generate Reports (CSV) <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
