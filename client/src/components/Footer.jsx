import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="portal-footer">
      <div className="footer-grid">
        {/* Col 1: About */}
        <div className="footer-col" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ background: '#0d9488', color: '#ffffff', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
              W
            </div>
            <h5 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Women Entrepreneurship Support Portal</h5>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '420px', marginBottom: '1rem' }}>
            Centralized digital platform connecting women entrepreneurs with government schemes, capital grants, business training, expert mentorship, and national networking opportunities under SDG 5.
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} color="#0d9488" /> Verified Government Initiative</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartHandshake size={14} color="#be185d" /> SDG 5 Gender Equality</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/public-schemes">Government Schemes</Link></li>
            <li><Link to="/public-funding">Funding Grants</Link></li>
            <li><Link to="/public-training">Training Workshops</Link></li>
            <li><Link to="/public-events">Networking Events</Link></li>
            <li><Link to="/about">About SDG 5 Support</Link></li>
          </ul>
        </div>

        {/* Col 3: Support & Policies */}
        <div className="footer-col">
          <h5>Policy & Help</h5>
          <ul>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: All entrepreneur registration details and Udyam business data are stored securely under national data protection standards."); }}>Privacy Policy</a></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Access to funding grants and schemes is subject to Ministry of MSME eligibility criteria."); }}>Terms of Service</a></li>
            <li><a href="#support" onClick={(e) => { e.preventDefault(); alert("Support Portal: Email support@womenportal.gov.in or call toll-free helpline 1800-11-MSME."); }}>Support & FAQ</a></li>
            <li><Link to="/login">Officer Portal Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} Women Entrepreneurship Support Portal – Case Study 33 (SDG 5). All Rights Reserved.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Demonstration Version for Software Engineering University Evaluation
          </div>
        </div>
      </div>
    </footer>
  );
};
