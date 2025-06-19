import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.data && response.data.user) {
        login(response.data.user);
        navigate('/loja');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1 className="welcome-title">Bem-vindo</h1>
          <p className="login-subtitle">Faça seu login</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !email || !password}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Credenciais de teste:</strong></p>
          <p>Email: admin@livraria.com | Senha: 123456</p>
          <p>Email: usuario@teste.com | Senha: senha123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;