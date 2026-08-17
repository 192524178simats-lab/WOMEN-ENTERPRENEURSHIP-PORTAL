import React, { useState, useEffect } from 'react';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Users, UserCheck, UserX } from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      let url = `/api/users?search=${encodeURIComponent(search)}`;
      if (roleFilter !== 'All') url += `&role=${encodeURIComponent(roleFilter)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('wep_token')}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'User status updated!');
        fetchUsers();
      } else {
        addToast('error', data.error || 'Failed to update user status.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>System User Management</h1>
        <p style={{ color: '#64748b' }}>Audit all registered user accounts and toggle active/inactive access</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'role',
            label: 'User Role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: 'entrepreneur', label: 'Women Entrepreneur' },
              { value: 'officer', label: 'Government Officer' },
              { value: 'mentor', label: 'Mentor' }
            ]
          }
        ]}
        onReset={() => { setSearch(''); setRoleFilter('All'); }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488' }}>Loading users...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name & Email</th>
                <th>Phone</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: '700' }}>#{u.id}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{u.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td>
                    <StatusBadge status={u.is_active ? 'Active' : 'Inactive'} />
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`btn ${u.is_active ? 'btn-danger' : 'btn-primary'} btn-sm`}
                      onClick={() => toggleUserStatus(u.id, u.is_active)}
                    >
                      {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
