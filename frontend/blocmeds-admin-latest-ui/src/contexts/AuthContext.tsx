import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { username: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    const username = sessionStorage.getItem('username');
    if (auth === 'true' && username) {
      setIsAuthenticated(true);
      setUser({ username });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Hardcoded authentication
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('auth', 'true');
      sessionStorage.setItem('username', username);
      setIsAuthenticated(true);
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('username');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
