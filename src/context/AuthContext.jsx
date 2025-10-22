import React, { createContext, useContext, useState } from 'react'; // <-- Corrected this line

// Mock user data. In a real app, this would come from a backend.
const MOCK_USERS = {
  admin: { name: 'Dr. Admin', role: 'admin', permissions: ['admin', 'finance', 'admission'] },
  finance: { name: 'Sanjay Gupta', role: 'finance', permissions: ['finance'] },
  admission: { name: 'Meera Desai', role: 'admission', permissions: ['admission'] },
};

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username) => {
    // Simulate a login
    const user = MOCK_USERS[username];
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permission) => {
    // Check if user has the specific permission OR if they are an admin
    return currentUser?.permissions.includes(permission) || currentUser?.permissions.includes('admin');
  };

  const value = {
    currentUser,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};