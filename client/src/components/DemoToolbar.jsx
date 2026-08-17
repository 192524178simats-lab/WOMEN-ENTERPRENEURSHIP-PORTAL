import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCheck, ShieldCheck, Award } from 'lucide-react';

export const DemoToolbar = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const demoAccounts = {
    entrepreneur: { email: 'entrepreneur@womenportal.test', pass: 'Password123!', path: '/entrepreneur/dashboard', name: 'Priya Sharma (Entrepreneur)' },
    officer: { email: 'officer@womenportal.test', pass: 'Password123!', path: '/officer/dashboard', name: 'Rajesh Varma (Government Officer)' },
    mentor: { email: 'mentor@womenportal.test', pass: 'Password123!', path: '/mentor/dashboard', name: 'Dr. Sunita Rao (Mentor)' }
  };

  const quickSwitch = async (roleKey) => {
    const target = demoAccounts[roleKey];
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target.email, password: target.pass })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        addToast('success', `Switched to ${target.name}`);
        navigate(target.path);
      } else {
        addToast('error', data.error || 'Failed demo switch');
      }
    } catch (err) {
      addToast('error', 'Server unreachable');
    }
  };

  return (
    <div className="demo-toolbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={16} color="#fbbf24" />
        <span>Case Study 33 Demo Credentials Toolbar (SDG 5):</span>
      </div>
      <div className="role-buttons">
        <button className="btn-demo" onClick={() => quickSwitch('entrepreneur')}>
          👩‍💼 Entrepreneur Demo
        </button>
        <button className="btn-demo" onClick={() => quickSwitch('officer')}>
          🏛️ Officer Demo
        </button>
        <button className="btn-demo" onClick={() => quickSwitch('mentor')}>
          🎓 Mentor Demo
        </button>
      </div>
    </div>
  );
};
