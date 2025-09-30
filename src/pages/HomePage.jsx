import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Assuming your styles are in the root of src

function HomePage() {
  return (
    <div className="container">
      <h1>Organizational Cells</h1>
      <p>Select a cell to view its structure, roles, and responsibilities.</p>
      <nav>
        <ul className="navigation-links">
          <li><Link to="/finance">Financial Cell 🏦</Link></li>
          <li><Link to="/admission">Admission Cell 🎓</Link></li>
          <li><Link to="/administration">Administration Cell 🏛️</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;