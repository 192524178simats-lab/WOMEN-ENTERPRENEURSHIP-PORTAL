import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const SearchFilterBar = ({
  search,
  onSearchChange,
  filters = [], // [{ key, label, value, onChange, options: [{value, label}] }]
  onReset
}) => {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      {/* Search Input */}
      <div style={{ flex: '1 1 240px', position: 'relative' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Search by keywords, codes, names..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingLeft: '2.4rem' }}
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map((f) => (
        <div key={f.key} style={{ minWidth: '160px' }}>
          <select className="form-control" value={f.value} onChange={(e) => f.onChange(e.target.value)}>
            <option value="All">All {f.label}</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset Filter Button */}
      {onReset && (
        <button className="btn btn-secondary btn-sm" onClick={onReset} title="Reset filters">
          <RotateCcw size={16} /> Reset
        </button>
      )}
    </div>
  );
};
