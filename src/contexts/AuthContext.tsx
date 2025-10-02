import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState('admin7264');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedPassword) {
      setCurrentPassword(savedPassword);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === currentPassword) {
      const userData: User = {
        username: 'admin',
        email: 'admin@clesdeparis.com'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updatePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === currentPassword) {
      setCurrentPassword(newPassword);
      localStorage.setItem('adminPassword', newPassword);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updatePassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
