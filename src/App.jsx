import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import HomePage from './pages/HomePage';
import FinancePage from './pages/FinancePage';
import AdmissionPage from './pages/AdmissionPage';
import AdministrationPage from './pages/AdministrationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/administration" element={<AdministrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;