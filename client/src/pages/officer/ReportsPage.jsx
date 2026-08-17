import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { FileBarChart2, Download, Filter, Banknote, Users, Building2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ReportsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sector, setSector] = useState('All');
  const [status, setStatus] = useState('All');
  const [fundingType, setFundingType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { addToast } = useToast();

  const fetchReports = async () => {
    try {
      let url = `/api/reports/export?sector=${encodeURIComponent(sector)}&status=${encodeURIComponent(status)}&funding_type=${encodeURIComponent(fundingType)}`;
      if (dateFrom) url += `&date_from=${dateFrom}`;
      if (dateTo) url += `&date_to=${dateTo}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [sector, status, fundingType, dateFrom, dateTo]);

  // Aggregate metrics
  const totalApps = reportData.length;
  const approvedApps = reportData.filter(r => r.status === 'Approved');
  const totalRequested = reportData.reduce((acc, curr) => acc + (curr.requested_amount || 0), 0);
  const totalApproved = approvedApps.reduce((acc, curr) => acc + (curr.requested_amount || 0), 0);

  // Chart data aggregation
  const sectorMap = {};
  reportData.forEach(r => {
    const sec = r.sector || 'Uncategorized';
    sectorMap[sec] = (sectorMap[sec] || 0) + (r.requested_amount || 0);
  });
  const chartSectorData = Object.keys(sectorMap).map(k => ({ name: k, amount: sectorMap[k] }));

  // Export to CSV Function
  const exportToCSV = () => {
    if (reportData.length === 0) {
      addToast('warning', 'No report data to export.');
      return;
    }

    const headers = ['Application No', 'Entrepreneur', 'Email', 'Phone', 'Business Name', 'Sector', 'Funding Name', 'Funding Type', 'Requested Amount (INR)', 'Status', 'Date'];
    const rows = reportData.map(r => [
      `"${r.application_no}"`,
      `"${r.entrepreneur_name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.business_name}"`,
      `"${r.sector}"`,
      `"${r.funding_name}"`,
      `"${r.funding_type}"`,
      r.requested_amount,
      `"${r.status}"`,
      `"${new Date(r.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Women_Entrepreneurship_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report exported to CSV successfully!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Reports & System Analytics</h1>
          <p style={{ color: '#64748b' }}>Generate filtered government reports, evaluate sector allocations, and export data</p>
        </div>
        <button className="btn btn-primary" onClick={exportToCSV}>
          <Download size={18} /> Export Report (CSV)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={18} color="#0d9488" /> Report Query Filters
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Business Sector</label>
            <select className="form-control" value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="All">All Sectors</option>
              <option value="Textiles & Handicrafts">Textiles & Handicrafts</option>
              <option value="Biotechnology & Healthcare">Biotechnology & Healthcare</option>
              <option value="Technology & CleanTech">Technology & CleanTech</option>
              <option value="Agriculture & Food Processing">Agriculture & Food Processing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Application Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Funding Type</label>
            <select className="form-control" value={fundingType} onChange={(e) => setFundingType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Government Grant">Government Grant</option>
              <option value="Subsidy">Subsidy</option>
              <option value="Loan">Loan</option>
              <option value="Startup Funding">Startup Funding</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date From</label>
            <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Date To</label>
            <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="card-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={FileBarChart2} value={totalApps} label="Matching Applications" color="#0284c7" bg="#e0f2fe" />
        <StatCard icon={Banknote} value={`₹${(totalRequested / 100000).toFixed(1)}L`} label="Total Requested Amount" color="#b45309" bg="#fef3c7" />
        <StatCard icon={Banknote} value={`₹${(totalApproved / 100000).toFixed(1)}L`} label="Sanctioned Capital Grant" color="#15803d" bg="#dcfce7" />
      </div>

      {/* Visual Chart */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Requested Grant Amount by Sector (₹)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSectorData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Summary Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>App No</th>
              <th>Entrepreneur & Business</th>
              <th>Sector</th>
              <th>Scheme Name</th>
              <th>Requested Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '800', color: '#0d9488' }}>{r.application_no}</td>
                <td>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{r.business_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Owner: {r.entrepreneur_name}</div>
                </td>
                <td>{r.sector}</td>
                <td>{r.funding_name}</td>
                <td style={{ fontWeight: '800', color: '#059669' }}>₹{r.requested_amount?.toLocaleString()}</td>
                <td><StatusBadge status={r.status} /></td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
