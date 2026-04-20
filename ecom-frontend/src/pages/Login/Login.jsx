import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast/ToastProvider';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.user, res.data.token);
      showToast('Welcome back! 🎉', 'success');
      navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role) => {
    let demoUser;
    if (role === 'admin') {
      demoUser = { user_id: 0, name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN' };
    } else if (role === 'employee') {
      demoUser = { user_id: 50, name: 'Employee Staff', email: 'staff@demo.com', role: 'EMPLOYEE' };
    } else {
      demoUser = { user_id: 99, name: 'Demo User', email: 'user@demo.com', role: 'USER' };
    }
    
    login(demoUser, 'demo-token');
    showToast(`Logged in as ${role} (demo mode)`, 'success');
    navigate(role === 'admin' ? '/admin' : role === 'employee' ? '/staff' : '/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back 👋</h1>
          <p className="auth-sub">Sign in to your Nexo account</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" id="login-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-divider"><span>or try demo</span></div>
        <div className="demo-btns">
          <button className="btn btn-ghost btn-sm" onClick={() => demoLogin('user')}  id="demo-user-btn">User</button>
          <button className="btn btn-ghost btn-sm" onClick={() => demoLogin('employee')} id="demo-employee-btn">Employee</button>
          <button className="btn btn-ghost btn-sm" onClick={() => demoLogin('admin')} id="demo-admin-btn">Admin</button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
