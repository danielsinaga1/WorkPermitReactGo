import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services';
import type { UserRole } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Try to get user from localStorage first for speed
      const storedUser = authService.getUser();
      if (storedUser) {
        setUser(storedUser as User);
      }
      // Verify token is still valid
      authService
        .me()
        .then((apiUser) => {
          setUser(apiUser as User);
          authService.saveUser(apiUser);
        })
        .catch(() => {
          // Token invalid, clean up
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Save token and user
      authService.saveToken(response.access_token);
      authService.saveUser(response.user);

      setUser(response.user as User);
      setIsLoading(false);

      return { success: true, message: 'Login berhasil!' };
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error?.response?.data?.message || 'Email atau password salah!';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if API call fails, clean up locally
    }
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
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

export default AuthContext;
