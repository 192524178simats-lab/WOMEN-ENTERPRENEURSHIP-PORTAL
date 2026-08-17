import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Users, Award, ShieldCheck } from 'lucide-react';

export const MentorManagementPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentors?status=All');
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Mentor Directory Management</h1>
        <p style={{ color: '#64748b' }}>Oversee certified mentors, qualifications, and availability schedules</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading mentors...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mentor Name</th>
                <th>Professional Title & Industry</th>
                <th>Expertise</th>
                <th>Experience</th>
                <th>Availability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{m.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.email} | {m.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{m.professional_bg}</div>
                    <div style={{ fontSize: '0.75rem', color: '#0d9488' }}>{m.industry}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{m.expertise}</td>
                  <td style={{ fontWeight: '700' }}>{m.years_experience} Years</td>
                  <td style={{ fontSize: '0.85rem' }}>{m.availability}</td>
                  <td><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
