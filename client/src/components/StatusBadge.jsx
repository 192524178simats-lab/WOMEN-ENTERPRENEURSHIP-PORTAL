import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  let badgeClass = 'badge-info';

  if (['verified', 'approved', 'active', 'confirmed', 'completed', 'success'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['pending', 'submitted', 'under-review', 'additional-information-required', 'pending-verification', 'upcoming'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['rejected', 'cancelled', 'archived', 'inactive', 'withdrawn'].includes(normalized)) {
    badgeClass = 'badge-danger';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};
