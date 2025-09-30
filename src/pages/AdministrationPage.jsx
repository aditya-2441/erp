import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

// --- Mock Data for the Admin Dashboard ---
const staffMembers = [
  { id: 'E01', name: 'Dr. Anjali Sharma', department: 'Computer Science', role: 'Head of Department', status: 'Active' },
  { id: 'E02', name: 'Prof. Vikram Singh', department: 'Mechanical Engg.', role: 'Professor', status: 'Active' },
  { id: 'E03', name: 'Meera Desai', department: 'Admissions', role: 'Admissions Officer', status: 'Active' },
  { id: 'E04', name: 'Sanjay Gupta', department: 'Finance', role: 'Chief Financial Officer', status: 'On Leave' },
];

const hiringPipeline = [
  { id: 'H01', role: 'Assistant Professor, CS', candidates: 5, stage: 'Interview' },
  { id: 'H02', role: 'Lab Technician', candidates: 12, stage: 'Screening' },
  { id: 'H03', role: 'Placement Coordinator', candidates: 3, stage: 'Offer Released' },
];

const budgets = [
  { id: 'B01', department: 'Computer Science', allocated: 5000000, spent: 3200000 },
  { id: 'B02', department: 'Administration', allocated: 2500000, spent: 2450000 },
  { id: 'B03', department: 'Library', allocated: 1200000, spent: 850000 },
  { id: 'B04', department: 'Placements', allocated: 1500000, spent: 750000 },
];

function AdministrationPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessSalaries = () => {
    setIsProcessing(true);
    alert('Initiating monthly payroll processing...');
    // Simulate a network request
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payroll for all departments processed successfully!');
    }, 2000);
  };

  return (
    <div className="container elegant-ui">
      <header className="page-header">
        <div>
          <h1>Administration Dashboard</h1>
          <p className="subtitle">Oversee staff, hiring, budgets, and payroll.</p>
        </div>
        <Link to="/" className="btn btn-secondary"><span>🏠</span> Back to Home</Link>
      </header>

      <div className="content-grid-admin">
        {/* Staff Directory */}
        <div className="content-card full-width">
          <h2>Staff Directory</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th><th>Name</th><th>Department</th><th>Role</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map(staff => (
                  <tr key={staff.id}>
                    <td>{staff.id}</td><td>{staff.name}</td><td>{staff.department}</td><td>{staff.role}</td>
                    <td><span className={`status ${staff.status.replace(' ', '-').toLowerCase()}`}>{staff.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hiring & Budgets */}
        <div className="content-card">
          <h2>Hiring Pipeline</h2>
          <ul className="hiring-list">
            {hiringPipeline.map(job => (
              <li key={job.id}>
                <span className="job-role">{job.role}</span>
                <span className="job-stage">{job.stage} ({job.candidates} candidates)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="content-card">
          <h2>Departmental Budgets</h2>
          <ul className="budget-list">
            {budgets.map(b => (
              <li key={b.id}>
                <div className="budget-info">
                  <span className="budget-dept">{b.department}</span>
                  <span className="budget-amount">₹{b.spent.toLocaleString()} / ₹{b.allocated.toLocaleString()}</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{width:`${(b.spent / b.allocated) * 100}%`}}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Salary Processing */}
        <div className="content-card full-width">
          <h2>Payroll Processing</h2>
          <div className="payroll-section">
            <p>Initiate the automated salary disbursement for all active staff and faculty for the current month.</p>
            <button onClick={handleProcessSalaries} className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Process Monthly Salaries'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdministrationPage;