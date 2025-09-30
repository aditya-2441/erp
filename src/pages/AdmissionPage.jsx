import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

// --- (Modal and FeeCalculator components remain the same as before) ---
const Modal = ({ children, onClose }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <button onClick={onClose} className="modal-close-btn">&times;</button>
      {children}
    </div>
  </div>
);

const FeeCalculator = ({ onClose }) => {
  const [formData, setFormData] = useState({ marks: '', gender: 'male', course: 'computer-science', domicile: 'state', category: 'general' });
  const [feeStructure, setFeeStructure] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateFees = (e) => {
    e.preventDefault();
    const { marks, gender, course, domicile, category } = formData;
    let baseTuition = 80000;
    if (course === 'business-admin') baseTuition = 75000;
    if (course === 'mechanical-engg') baseTuition = 85000;
    let scholarship = marks >= 95 ? 20000 : (marks >= 90 ? 10000 : 0);
    let domicileWaiver = domicile === 'state' ? 5000 : 0;
    let categoryDiscount = (category === 'sc' || category === 'st') ? 15000 : 0;
    const totalDeductions = scholarship + domicileWaiver + categoryDiscount;
    const finalAmount = baseTuition - totalDeductions;
    setFeeStructure({ baseTuition, scholarship, domicileWaiver, categoryDiscount, totalDeductions, finalAmount });
  };

  return (
    <div>
      <h2>Fee Structure Generator</h2>
      <p>Enter student details to calculate the applicable fees.</p>
      <form onSubmit={calculateFees} className="fee-form">
        <div className="form-grid">
          <label>12th Marks (%) <input type="number" name="marks" value={formData.marks} onChange={handleInputChange} required /></label>
          <label>Gender <select name="gender" value={formData.gender} onChange={handleInputChange}><option value="male">Male</option><option value="female">Female</option></select></label>
          <label>Course
            <select name="course" value={formData.course} onChange={handleInputChange}>
              <option value="computer-science">Computer Science</option>
              <option value="business-admin">Business Admin</option>
              <option value="mechanical-engg">Mechanical Engg.</option>
            </select>
          </label>
          <label>Domicile <select name="domicile" value={formData.domicile} onChange={handleInputChange}><option value="state">Home State</option><option value="other">Other State</option></select></label>
          <label>Category
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Calculate Fees</button>
      </form>
      {feeStructure && (
        <div className="fee-breakdown">
          <h3>Fee Breakdown</h3>
          <ul>
            <li><span>Base Tuition Fee:</span> <strong>₹{feeStructure.baseTuition.toLocaleString()}</strong></li>
            <li className="deduction"><span>Merit Scholarship:</span> <strong>- ₹{feeStructure.scholarship.toLocaleString()}</strong></li>
            <li className="deduction"><span>Domicile Waiver:</span> <strong>- ₹{feeStructure.domicileWaiver.toLocaleString()}</strong></li>
            <li className="deduction"><span>Category Discount:</span> <strong>- ₹{feeStructure.categoryDiscount.toLocaleString()}</strong></li>
          </ul>
          <hr />
          <div className="final-amount">
            <span>Total Payable Amount:</span>
            <strong>₹{feeStructure.finalAmount.toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Mock Data ---
const initialStudents = [
  { id: 'S001', name: 'Rohan Sharma', course: 'Computer Science', status: 'Active', feesPaid: 60000, totalFees: 80000 },
  { id: 'S002', name: 'Priya Verma', course: 'Business Admin', status: 'Pending ERP', feesPaid: 75000, totalFees: 75000 },
  { id: 'S003', name: 'Amit Patel', course: 'Mechanical Engg.', status: 'Active', feesPaid: 55000, totalFees: 85000 },
];

// --- NEW Main Page Component ---
function AdmissionPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIssueDocument = (studentId) => alert(`Generating Bonafide Certificate for student ${studentId}...`);
  const handleManageFees = (student) => alert(`Student: ${student.name}\nFees Paid: ${student.feesPaid}\nRemaining: ${student.totalFees - student.feesPaid}`);
  const handleAllocateERP = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status: 'Active' } : s));
    alert(`ERP access allocated for student ${studentId}!`);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container elegant-ui">
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)}><FeeCalculator /></Modal>}
      
      <header className="page-header">
        <div>
          <h1>Admission Dashboard</h1>
          <p className="subtitle">Manage student admissions and records.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary"><span>🧮</span> Fee Calculator</button>
          <button className="btn btn-primary"><span>+</span> Add New Student</button>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search students by name or ID..."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="student-card-grid">
        {filteredStudents.map((student) => (
          <div className="student-card" key={student.id}>
            <div className="card-header">
              <div>
                <h3 className="student-name">{student.name}</h3>
                <p className="student-id">{student.id}</p>
              </div>
              <span className={`status ${student.status.replace(' ', '-').toLowerCase()}`}>{student.status}</span>
            </div>
            <div className="card-body">
              <p><strong>Course:</strong> {student.course}</p>
            </div>
            <div className="card-footer">
              <button onClick={() => handleManageFees(student)} className="btn-icon">💰 Manage Fees</button>
              <button onClick={() => handleIssueDocument(student.id)} className="btn-icon">📄 Issue Docs</button>
              {student.status === 'Pending ERP' && (
                <button onClick={() => handleAllocateERP(student.id)} className="btn-icon-success">✓ Allocate ERP</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdmissionPage;