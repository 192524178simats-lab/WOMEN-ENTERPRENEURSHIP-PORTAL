import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag } from 'lucide-react';

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements?status=Active');
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Government Announcements</h1>
        <p style={{ color: '#64748b' }}>Latest policy updates, grant notifications, and ministry releases</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No active announcements.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-info">{a.category}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> Published: {a.published_date}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>{a.title}</h3>
              <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: '1.6' }}>{a.description}</p>

              {a.publisher && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#0d9488', fontWeight: '700' }}>
                  Issued by: {a.publisher}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
