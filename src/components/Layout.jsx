import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const SidebarLink = ({ to, permission, icon, label }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return null;
  }
  
  return (
    <NavLink to={to} className="sidebar-link">
      <span>{icon}</span> {label}
    </NavLink>
  );
};

function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <div className="layout-wrapper">
      <nav className="sidebar">
        <div>
          <div className="sidebar-header">ERP-PRO</div>
          <nav className="sidebar-nav">
            <SidebarLink to="/dashboard" permission="admin" icon="🏠" label="Dashboard" />
            <SidebarLink to="/administration" permission="admin" icon="🏛️" label="Administration" />
            <SidebarLink to="/finance" permission="finance" icon="🏦" label="Finance" />
            <SidebarLink to="/admission" permission="admission" icon="🎓" label="Admissions" />
            {/* Add more links here (e.g., Library, Faculty, etc.) */}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary" style={{width: '100%', color: 'var(--text-tertiary)'}}>
            <span>🔒</span> Logout
          </button>
        </div>
      </nav>
      
      <div className="main-content">
        <header className="header-bar">
          {/* This header can be dynamic based on the page later */}
          <h1>Welcome, {currentUser.name}</h1>
          <div className="header-user">
            <div className="header-user-name">
              {currentUser.name}
              <span>{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
            </div>
            {/* You can add an avatar here */}
          </div>
        </header>
        
        <main>
          <Outlet /> {/* This is where your pages will render */}
        </main>
      </div>
    </div>
  );
}

export default Layout;