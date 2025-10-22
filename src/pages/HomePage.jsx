import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

function HomePage() {
  const [username, setUsername] = useState('admin');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username)) {
      navigate('/dashboard'); 
    } else {
      setError('Invalid username. Try "admin", "finance", or "admission".');
    }
  };

  // --- NEW: Wrapper for centering ---
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--bg-layout) 0%, #e2e8f0 100%)' // Subtle gradient
    }}>
      <div style={{ maxWidth: '450px', width: '100%' }}> 
        {/* --- Card remains mostly the same --- */}
        <div className="content-card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ textAlign: 'center', marginTop: 0, color: 'var(--primary)' }}>🏫 University ERP</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please sign in to continue.</p>
          
          <form onSubmit={handleLogin} className="fee-form">
            <div className="form-grid-single-col" style={{gap: '1.5rem'}}>
              <label>Username / Role
                <select 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  style={{marginTop: '0.5rem'}}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="finance">Finance (Finance Only)</option>
                  <option value="admission">Admission (Admission Only)</option>
                </select>
              </label>
              <label>Password
                <input type="password" placeholder="Enter password" defaultValue="password" style={{marginTop: '0.5rem'}} />
                {/* Removed readOnly for better UX, but it's still mock */}
              </label>
            </div>
            {error && <p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '0.8rem' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;