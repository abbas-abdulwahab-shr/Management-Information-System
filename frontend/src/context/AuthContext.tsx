// Helper to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp is in seconds
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (jwt: string) => {
    setToken(jwt);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    await fetchUser(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      (async () => {
        await fetchUser(storedToken);
      })();
    } else {
      (async () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setLoading(false);
      })();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
