import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DemoToolbar } from './DemoToolbar';
import { Bell, User, LogOut, ShieldCheck, HeartHandshake, CheckCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Demo Role Switcher Toolbar */}
      <DemoToolbar />

      {/* Main Government Portal Navbar */}
      <header className="navbar">
        <Link to="/" className="navbar-brand">
          <div style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f172a 100%)',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '0 2px 5px rgba(13, 148, 136, 0.3)'
          }}>
            W
          </div>
          <div>
            <div className="brand-title">Women Entrepreneurship Support Portal</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
              Centralized Government Platform – SDG 5
            </div>
          </div>
        </Link>

        <nav>
          <ul className="navbar-nav">
            {!user ? (
              <>
                <li><Link to="/public-schemes" className="nav-link">Schemes</Link></li>
                <li><Link to="/public-funding" className="nav-link">Funding</Link></li>
                <li><Link to="/public-training" className="nav-link">Training</Link></li>
                <li><Link to="/public-events" className="nav-link">Networking</Link></li>
                <li><Link to="/about" className="nav-link">About</Link></li>
                <li><Link to="/login" className="btn btn-outline btn-sm">Login</Link></li>
                <li><Link to="/register" className="btn btn-primary btn-sm">Register</Link></li>
              </>
            ) : (
              <>
                {/* In-App Notifications Icon & Dropdown */}
                <li style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px' }}
                    aria-label="Notifications"
                  >
                    <Bell size={20} color="#475569" />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Grouped Notifications Dropdown */}
                  {showNotifs && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '40px',
                      width: '340px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #e2e8f0',
                      zIndex: 100,
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>In-App Notifications</div>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} style={{ background: 'transparent', border: 'none', color: '#0d9488', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <CheckCheck size={14} /> Mark All Read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>
                          No notifications.
                        </div>
                      ) : (
                        <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              style={{
                                background: n.is_read ? '#ffffff' : '#f0fdf4',
                                border: '1px solid',
                                borderColor: n.is_read ? '#f1f5f9' : '#bbf7d0',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              <div style={{ fontWeight: '700', color: '#0f172a' }}>{n.title}</div>
                              <div style={{ color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                                {new Date(n.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </li>

                {/* Profile Badge & Logout */}
                <li>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                    <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{user.role}</span>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>{user.full_name}</span>
                  </div>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};
