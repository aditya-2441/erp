import React from 'react';
import { Link } from 'react-router-dom';
import { rolesData } from '../data/rolesData'; // Correct path to data file
import '../styles.css';

function AdmissionPage() {
  const department = rolesData.admission;

  return (
    <div className="container">
      <Link to="/">&larr; Back to Home</Link>
      <h1>{department.name}</h1>
      <p className="description">{department.description}</p>
      <hr />
      
      <div className="responsibilities-section">
        <h3>Key Responsibilities for {department.mainRole}</h3>
        <ul>
          {department.responsibilities.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdmissionPage;