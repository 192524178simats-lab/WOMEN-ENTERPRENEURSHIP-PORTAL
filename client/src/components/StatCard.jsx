import React from 'react';

export const StatCard = ({ icon: Icon, value, label, color = '#0d9488', bg = '#f0fdf4' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bg, color: color }}>
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-lbl">{label}</div>
      </div>
    </div>
  );
};
