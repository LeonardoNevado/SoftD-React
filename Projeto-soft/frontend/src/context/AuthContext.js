import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Tentar salvar no sessionStorage se disponível
    try {
      if (typeof Storage !== 'undefined' && sessionStorage) {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.log('SessionStorage não disponível, dados mantidos apenas na sessão');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Tentar remover do sessionStorage se disponível
    try {
      if (typeof Storage !== 'undefined' && sessionStorage) {
        sessionStorage.removeItem('user');
      }
    } catch (error) {
      console.log('SessionStorage não disponível');
    }
  };

  // Verificar se há usuário salvo no sessionStorage ao inicializar
  React.useEffect(() => {
    try {
      if (typeof Storage !== 'undefined' && sessionStorage) {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.log('Erro ao recuperar dados do sessionStorage:', error);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};