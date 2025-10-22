import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { AuthProvider } from './context/AuthContext'; // <-- Import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap your App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);