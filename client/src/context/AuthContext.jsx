import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('wep_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('wep_token') || null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileData(data);
        localStorage.setItem('wep_user', JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('wep_user', JSON.stringify(userData));
    localStorage.setItem('wep_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfileData(null);
    localStorage.removeItem('wep_user');
    localStorage.removeItem('wep_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, profileData, loading, login, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
