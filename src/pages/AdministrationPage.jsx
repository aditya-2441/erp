import React from 'react';
import { Link } from 'react-router-dom';
import { rolesData } from '../data/rolesData'; // Correct path to data file
import '../styles.css';

function AdministrationPage() {
  const department = rolesData.administration;

  return (
    <div className="container">
      <Link to="/">&larr; Back to Home</Link>
      <h1>{department.name}</h1>
      <p className="description">{department.description}</p>
      <hr />

      {department.levels.map((level, index) => (
        <div key={index} className="level-section">
          <h3>{level.name}</h3>
          <ul>
            {level.roles && level.roles.map((role, idx) => (
              <li key={idx}><strong>{role.title}</strong></li>
            ))}
            {level.responsibilities && level.responsibilities.map((task, idx) => (
                 <li key={idx}>{task}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdministrationPage;