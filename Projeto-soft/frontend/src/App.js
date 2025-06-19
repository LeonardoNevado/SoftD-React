import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Shop from './pages/Shop';
import './App.css';

// Componente para redirecionar usuários autenticados
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/loja" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rota de login - redireciona para loja se já autenticado */}
            <Route 
              path="/" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            
            {/* Rota protegida da loja */}
            <Route 
              path="/loja" 
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              } 
            />

            {/* Redirecionar rotas não encontradas para login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;