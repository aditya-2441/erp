import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

// This is the card for each module link
const ModuleLink = ({ to, permission, title, icon, description }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null; // Don't render the card if the user lacks permission
  }

  return (
    <Link to={to} className="student-card" style={{ textDecoration: 'none' }}>
      <div className="card-header">
        <h3 className="student-name">{icon} {title}</h3>
      </div>
      <div className="card-body">
        <p>{description}</p>
      </div>
    </Link>
  );
};


function DashboardHomePage() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="container elegant-ui">
      <header className="page-header">
        <div>
          <h1>Welcome, {currentUser?.name}</h1>
          <p className="subtitle">Select a module to continue.</p>
        </div>
        <button onClick={logout} className="btn btn-secondary"><span>Logout</span></button>
      </header>

      <div className="student-card-grid" style={{marginTop: '2rem'}}>
        <ModuleLink
          to="/administration"
          permission="admin"
          icon="🏛️"
          title="Administration Cell"
          description="Manage staff, roles, budgets, and payroll."
        />
        <ModuleLink
          to="/finance"
          permission="finance"
          icon="🏦"
          title="Financial Cell"
          description="Handle fees, approvals, and departmental budgets."
        />
        <ModuleLink
          to="/admission"
          permission="admission"
          icon="🎓"
          title="Admission Cell"
          description="Oversee new applicants and enrolled student records."
        />
      </div>
    </div>
  );
}

export default DashboardHomePage;