// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
    
        if (res.ok) {
          const data = await res.json();
          console.log('data', data);
          setUser(data);
        } else if (res.status === 401) {
          // brak sesji – to normalne
          setUser(null);
        } else {
          console.warn('Błąd auth/me:', res.status);
          setUser(null);
        }
      } catch (err) {
        console.error('Błąd sieci w auth/me:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [setUser]);

  const logout = async () => {
    await fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
