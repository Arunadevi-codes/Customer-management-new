import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorage is unique per tab — admin tab and staff tab never share data
    const token      = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    // Each tab saves into its own sessionStorage — completely isolated
    sessionStorage.setItem('user',  JSON.stringify(userData));
    sessionStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    // Only clears THIS tab's session — other tabs unaffected
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};