import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, Target, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>UN SDG 5 Alignment</span>
          <h1 style={{ fontSize: '2.5rem', color: '#0f172a' }}>About Women Entrepreneurship Support Portal</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Empowering women-owned businesses through centralized digital governance
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#334155', lineHeight: '1.7' }}>
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target color="#0d9488" /> 1. The SDG 5 Mission
            </h3>
            <p>
              United Nations Sustainable Development Goal 5 aims to achieve gender equality and empower all women and girls. Economic empowerment through entrepreneurship is a crucial pillar of SDG 5. Historically, female founders faced fragmented information across dozens of ministry websites, complex paper compliance, and lack of direct mentorship.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#0d9488" /> 2. One Centralized Platform
            </h3>
            <p>
              The Women Entrepreneurship Support Portal unites government ministries, financial institutions, research universities, and certified business mentors into a unified digital ecosystem.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="#0d9488" /> 3. Role-Based Governance Architecture
            </h3>
            <p>
              Built using secure role-based authorization:
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Women Entrepreneurs</strong>: Manage business profiles, apply for capital grants, track applications, enroll in training, and schedule mentorship.</li>
              <li><strong>Government Officers</strong>: Verify registrations, evaluate funding applications, create schemes, manage events, and generate real-time analytics reports.</li>
              <li><strong>Certified Mentors</strong>: Provide strategic guidance, conduct virtual sessions, and support female founders during scale-up.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
