import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../services/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.verifyToken(token);
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (error: any) {
          // Solo removemos el token si es un error 401 (no autorizado/token expirado)
          if (error.response && error.response.status === 401) {
            console.error('Token expirado o inválido');
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Para otros errores (red, servidor, etc), mantenemos la sesión y datos del usuario
            console.error('Error de conexión al verificar token:', error);
            // Intentamos obtener los datos del usuario del localStorage
            try {
              const savedUserData = localStorage.getItem('userData');
              if (savedUserData) {
                setUser(JSON.parse(savedUserData));
              }
            } catch (e) {
              console.error('Error al recuperar datos del usuario:', e);
            }
            setIsAuthenticated(true);
          }
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Guardamos los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('No se recibió token en la respuesta del login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const response = await authService.register(name, email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Guardamos los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('No se recibió token en la respuesta del registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData'); // También limpiamos los datos del usuario
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 