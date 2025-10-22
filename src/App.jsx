import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Layout
import Layout from './components/Layout'; // <-- Import Layout

// Import your page components
import HomePage from './pages/HomePage'; // This is our Login Page
import DashboardHomePage from './pages/DashboardHomePage';
import FinancePage from './pages/FinancePage';
import AdmissionPage from './pages/AdmissionPage';
import AdministrationPage from './pages/AdministrationPage';

// This component now just wraps the children
// It's cleaner to check permissions here
const ProtectedRoute = ({ children, permission }) => {
  const { currentUser, hasPermission } = useAuth();

  if (!currentUser) {
    // If not logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }

  if (permission && !hasPermission(permission)) {
    // If logged in but lacks specific permission, redirect to main dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Render the child component
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login Page */}
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes all go inside the Layout */}
        <Route element={<Layout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardHomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/administration" 
            element={
              <ProtectedRoute permission="admin">
                <AdministrationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/finance" 
            element={
              <ProtectedRoute permission="finance">
                <FinancePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admission" 
            element={
              <ProtectedRoute permission="admission">
                <AdmissionPage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Fallback for any other path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;