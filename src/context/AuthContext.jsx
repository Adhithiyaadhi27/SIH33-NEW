import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to Consumer persona, can switch anytime
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agridirect_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [token, setToken] = useState(() => localStorage.getItem('agridirect_jwt_token') || 'demo_token_valid');
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agridirect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agridirect_user');
    }
  }, [currentUser]);

  // Quick Demo Persona Switcher for evaluation
  const switchRolePersona = (roleName) => {
    const matched = INITIAL_USERS.find(u => u.role.toLowerCase() === roleName.toLowerCase()) || INITIAL_USERS[0];
    setCurrentUser(matched);
    const mockToken = `jwt_mock_${matched.id}_${Date.now()}`;
    setToken(mockToken);
    localStorage.setItem('agridirect_jwt_token', mockToken);
  };

  const login = (email, password, roleHint) => {
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
                    INITIAL_USERS.find(u => u.role.toLowerCase() === (roleHint || 'consumer').toLowerCase()) ||
                    INITIAL_USERS[0];
    setCurrentUser(matched);
    const mockToken = `jwt_mock_${matched.id}_${Date.now()}`;
    setToken(mockToken);
    localStorage.setItem('agridirect_jwt_token', mockToken);
    return matched;
  };

  const register = (userData) => {
    // Critical rule: Admin cannot register publicly, and Farmer dashboard is disallowed
    if (userData.role === 'Admin') {
      throw new Error('Admin registration is restricted to internal operations.');
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      ...userData
    };
    setCurrentUser(newUser);
    setEmailVerified(false); // Needs verification UI
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('agridirect_user');
    localStorage.removeItem('agridirect_jwt_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'Guest',
        token,
        emailVerified,
        setEmailVerified,
        login,
        register,
        logout,
        switchRolePersona,
        availablePersonas: INITIAL_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
