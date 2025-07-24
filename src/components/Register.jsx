import React, { useState } from 'react';
import './Register.css';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-title">
            <div className="brand-main brand-main-font">A Hornear</div>
            <div className="brand-cursive cursive-text" data-text="By Gaby">By Gaby</div>
          </div>
          <h2>
            <i className="fas fa-user-plus"></i>
            Crear Cuenta
          </h2>
        </div>

        <div className="auth-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            className="btn btn-secondary btn-sm theme-toggle"
            title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
            {isDark ? 'Claro' : 'Oscuro'}
          </button>
        </div>

        <form className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;