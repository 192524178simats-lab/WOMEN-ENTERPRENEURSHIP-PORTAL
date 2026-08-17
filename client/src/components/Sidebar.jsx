import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Building2,
  FileSpreadsheet,
  Banknote,
  FileCheck2,
  GraduationCap,
  Users,
  MessageSquare,
  Radio,
  Megaphone,
  BarChart3,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user.role;

  return (
    <aside className="sidebar">
      <div style={{ padding: '0.5rem 0.75rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0d9488', fontWeight: '800', letterSpacing: '0.05em' }}>
          {role === 'entrepreneur' ? 'Female Founder Workspace' : role === 'officer' ? 'Government Admin Workspace' : 'Certified Mentor Workspace'}
        </div>
        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem', marginTop: '2px' }}>{user.full_name}</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexGrow: 1 }}>
        {role === 'entrepreneur' && (
          <>
            <NavLink to="/entrepreneur/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/entrepreneur/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
            <NavLink to="/entrepreneur/business" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} /> My Business
            </NavLink>
            <NavLink to="/entrepreneur/schemes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={18} /> Government Schemes
            </NavLink>
            <NavLink to="/entrepreneur/funding" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Banknote size={18} /> Funding
            </NavLink>
            <NavLink to="/entrepreneur/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> My Applications
            </NavLink>
            <NavLink to="/entrepreneur/training" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} /> Training
            </NavLink>
            <NavLink to="/entrepreneur/mentors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Mentors
            </NavLink>
            <NavLink to="/entrepreneur/mentorship-requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Mentorship
            </NavLink>
            <NavLink to="/entrepreneur/networking" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Radio size={18} /> Networking
            </NavLink>
            <NavLink to="/entrepreneur/announcements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Megaphone size={18} /> Announcements
            </NavLink>
          </>
        )}

        {role === 'officer' && (
          <>
            <NavLink to="/officer/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/officer/entrepreneurs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Entrepreneurs & Verification
            </NavLink>
            <NavLink to="/officer/schemes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={18} /> Schemes
            </NavLink>
            <NavLink to="/officer/funding" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Banknote size={18} /> Funding
            </NavLink>
            <NavLink to="/officer/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Applications
            </NavLink>
            <NavLink to="/officer/training" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} /> Training
            </NavLink>
            <NavLink to="/officer/mentors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Mentors
            </NavLink>
            <NavLink to="/officer/networking" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Radio size={18} /> Networking
            </NavLink>
            <NavLink to="/officer/announcements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Megaphone size={18} /> Announcements
            </NavLink>
            <NavLink to="/officer/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} /> Reports & Analytics
            </NavLink>
            <NavLink to="/officer/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={18} /> User Management
            </NavLink>
          </>
        )}

        {role === 'mentor' && (
          <>
            <NavLink to="/mentor/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/mentor/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile & Availability
            </NavLink>
            <NavLink to="/mentor/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Mentorship Requests
            </NavLink>
            <NavLink to="/mentor/entrepreneurs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> My Entrepreneurs
            </NavLink>
            <NavLink to="/mentor/sessions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} /> Sessions & Feedback
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};
