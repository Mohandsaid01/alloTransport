import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (data) => {
    setUser(data);
    if (data.role === 'client') navigate('/dashboard/client');
    else if (data.role === 'agent') navigate('/dashboard/agent');
    else if (data.role === 'admin') navigate('/dashboard/admin');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
