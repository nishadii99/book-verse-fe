import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi, getToken, setTokens, clearTokens, getStoredUser, setStoredUser, getErrorMessage } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstname: string, lastname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        // Optionally verify token by fetching profile
        try {
          const response = await authApi.getProfile();
          if (response.data) {
            setUser(response.data);
            setStoredUser(response.data);
          }
        } catch (error) {
          // Token expired or invalid
          clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { accessToken, refreshToken, roles } = response.data;
    setTokens(accessToken, refreshToken);

    // Fetch full profile
    const profileResponse = await authApi.getProfile();
    const userData = profileResponse.data;
    setUser(userData);
    setStoredUser(userData);
  };

  const register = async (email: string, password: string, firstname: string, lastname: string) => {
    await authApi.register(email, password, firstname, lastname);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('ADMIN') || false;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isAdmin, login, register, logout }}>
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
