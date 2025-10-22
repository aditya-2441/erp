import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import { useAuth } from '../context/AuthContext'; 

// --- Enhanced Mock Data (Managed by State) ---
const initialStudents = [
  { id: 'S001', name: 'Rohan Sharma', course: 'Computer Science', status: 'Active', email: 'rohan.sharma@student.univ.edu', phone: '9123456780', joinDate: '2023-08-01', totalFees: 80000, feesPaid: 60000 },
  { id: 'S002', name: 'Priya Verma', course: 'Business Admin', status: 'Pending ERP', email: 'priya.verma@student.univ.edu', phone: '9123456781', joinDate: '2023-08-01', totalFees: 75000, feesPaid: 75000 },
  { id: 'S003', name: 'Amit Patel', course: 'Mechanical Engg.', status: 'Active', email: 'amit.patel@student.univ.edu', phone: '9123456782', joinDate: '2023-08-01', totalFees: 85000, feesPaid: 55000 },
];

const initialApplicants = [
  { id: 'A101', name: 'Kavita Singh', course: 'Computer Science', marks: 96, status: 'Pending Review' },
  { id: 'A102', name: 'Rahul Roy', course: 'Mechanical Engg.', marks: 88, status: 'Pending Review' },
  { id: 'A103', name: 'Sneha Gupta', course: 'Business Admin', marks: 92, status: 'Pending Review' },
];

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <button onClick={onClose} className="modal-close-btn">&times;</button>
      {children}
    </div>
  </div>
);

// --- Fee Calculator Logic (as a reusable hook/function) ---
const calculateFeeStructure = (formData) => {
  const { marks, course, domicile, category } = formData;
  let baseTuition = 80000;
  if (course === 'Business Admin') baseTuition = 75000;
  if (course === 'Mechanical Engg.') baseTuition = 85000;

  const numericMarks = parseFloat(marks) || 0;
  let scholarship = numericMarks >= 95 ? 20000 : (numericMarks >= 90 ? 10000 : 0);
  let domicileWaiver = domicile === 'Home State' ? 5000 : 0;
  let categoryDiscount = (category === 'SC' || category === 'ST') ? 15000 : 0;
  
  const totalDeductions = scholarship + domicileWaiver + categoryDiscount;
  const finalAmount = baseTuition - totalDeductions;
  
  return { baseTuition, scholarship, domicileWaiver, categoryDiscount, totalDeductions, finalAmount };
};

// --- New Student Form Component (with integrated Fee Calc) ---
const StudentForm = ({ student, onSubmit, onClose }) => {
  const isEditing = !!student;
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    course: student?.course || 'Computer Science',
    joinDate: student?.joinDate || new Date().toISOString().split('T')[0],
    // Fee calculation fields
    marks: student?.marks || 90,
    domicile: student?.domicile || 'Home State',
    category: student?.category || 'General',
    // Fee status fields
    totalFees: student?.totalFees || 0,
    feesPaid: student?.feesPaid || 0,
    status: student?.status || 'Pending ERP',
  });

  // Recalculate fees whenever relevant form data changes
  const feeStructure = useMemo(() => {
    return calculateFeeStructure(formData);
  }, [formData.marks, formData.course, formData.domicile, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalStudentData = {
      ...formData,
      id: isEditing ? student.id : `S${Date.now() % 1000}`,
      totalFees: feeStructure.finalAmount, // Set the calculated total fees
      feesPaid: parseFloat(formData.feesPaid) || 0, // Ensure this is a number
    };
    onSubmit(finalStudentData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="fee-form">
      <h2>{isEditing ? 'Edit Student Details' : 'Add New Student'}</h2>
      
      <h3 style={{marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>Student Information</h3>
      <div className="form-grid">
        <label>Full Name <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Email <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
        <label>Phone <input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></label>
        <label>Join Date <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} /></label>
      </div>

      <h3 style={{marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>Fee & Admission Details</h3>
      <div className="form-grid">
        <label>Course
          <select name="course" value={formData.course} onChange={handleChange}>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Admin">Business Admin</option>
            <option value="Mechanical Engg.">Mechanical Engg.</option>
          </select>
        </label>
        <label>12th Marks (%) <input type="number" name="marks" value={formData.marks} onChange={handleChange} required /></label>
        <label>Domicile
          <select name="domicile" value={formData.domicile} onChange={handleChange}>
            <option value="Home State">Home State</option>
            <option value="Other State">Other State</option>
          </select>
        </label>
        <label>Category
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </label>
        <label>Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending ERP">Pending ERP</option>
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
          </select>
        </label>
        <label>Initial Fees Paid (₹) <input type="number" name="feesPaid" value={formData.feesPaid} onChange={handleChange} /></label>
      </div>

      {/* Live Fee Breakdown */}
      <div className="fee-breakdown" style={{marginTop: '1rem'}}>
        <h3>Generated Fee Structure</h3>
        <ul>
          <li><span>Base Tuition:</span> <strong>₹{feeStructure.baseTuition.toLocaleString()}</strong></li>
          <li className="deduction"><span>Scholarship:</span> <strong>- ₹{feeStructure.scholarship.toLocaleString()}</strong></li>
          <li className="deduction"><span>Waivers:</span> <strong>- ₹{(feeStructure.domicileWaiver + feeStructure.categoryDiscount).toLocaleString()}</strong></li>
        </ul>
        <hr />
        <div className="final-amount">
          <span>Total Payable Amount (Annual):</span>
          <strong>₹{feeStructure.finalAmount.toLocaleString()}</strong>
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
        {isEditing ? 'Save Changes' : 'Enroll Student'}
      </button>
    </form>
  );
};

// --- Standalone Fee Calculator (for the tab) ---
const FeeCalculator = () => {
  const [formData, setFormData] = useState({ marks: '', gender: 'male', course: 'Computer Science', domicile: 'Home State', category: 'General' });
  const [feeStructure, setFeeStructure] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeeStructure(calculateFeeStructure(formData));
  };

  return (
    <div className="content-card full-width">
      <h2>Fee Structure Generator</h2>
      <p>Enter student details to calculate the applicable fees.</p>
      <form onSubmit={handleSubmit} className="fee-form">
        <div className="form-grid">
          <label>12th Marks (%) <input type="number" name="marks" value={formData.marks} onChange={handleInputChange} required /></label>
          <label>Course
            <select name="course" value={formData.course} onChange={handleInputChange}>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Admin">Business Admin</option>
              <option value="Mechanical Engg.">Mechanical Engg.</option>
            </select>
          </label>
          <label>Domicile
            <select name="domicile" value={formData.domicile} onChange={handleInputChange}>
              <option value="Home State">Home State</option>
              <option value="Other State">Other State</option>
            </select>
          </label>
          <label>Category
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="st">ST</option> {/* <-- THIS LINE IS NOW CORRECTED */}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Calculate Fees</button>
      </form>
      {feeStructure && (
        <div className="fee-breakdown" style={{marginTop: '1.5rem'}}>
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


// --- Main Page Component ---
function AdmissionPage() {
  const { logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('directory');
  const [students, setStudents] = useState(initialStudents);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- Modal States ---
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = Add, object = Edit
  const [feeDetailsStudent, setFeeDetailsStudent] = useState(null); // For "Manage Fees" modal

  // --- Utility Functions ---
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
  };

  // --- Student CRUD Handlers ---
  const handleOpenStudentModal = (student = null) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleStudentFormSubmit = (studentData) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
      showSuccessMessage(`Successfully updated ${studentData.name}.`);
    } else {
      setStudents(prev => [studentData, ...prev]);
      showSuccessMessage(`Successfully enrolled ${studentData.name}.`);
    }
  };

  // --- Applicant Workflow Handlers ---
  const handleApproveApplicant = (applicant) => {
    if (window.confirm(`Are you sure you want to approve ${applicant.name} for ${applicant.course}?`)) {
      // 1. Create a new student object from the applicant
      const feeData = calculateFeeStructure(applicant);
      const newStudent = {
        id: `S${Date.now() % 1000}`,
        name: applicant.name,
        email: `${applicant.name.toLowerCase().replace(' ', '.')}@student.univ.edu`,
        phone: '',
        course: applicant.course,
        joinDate: new Date().toISOString().split('T')[0],
        marks: applicant.marks,
        domicile: applicant.domicile || 'Home State',
        category: applicant.category || 'General',
        totalFees: feeData.finalAmount,
        feesPaid: 0,
        status: 'Pending ERP', // Default status for new students
      };
      
      // 2. Add them to the students list
      setStudents(prev => [newStudent, ...prev]);
      
      // 3. Remove them from the applicants list
      setApplicants(prev => prev.filter(a => a.id !== applicant.id));
      
      // 4. Show success
      showSuccessMessage(`Approved ${newStudent.name}. They are now in the Student Directory.`);
    }
  };

  const handleRejectApplicant = (applicant) => {
     if (window.confirm(`Are you sure you want to reject ${applicant.name}?`)) {
        setApplicants(prev => prev.filter(a => a.id !== applicant.id));
        showSuccessMessage(`Rejected ${applicant.name}.`);
     }
  };

  // --- Student Card Action Handlers ---
  const handleIssueDocument = (studentId) => {
    showSuccessMessage(`Generating Bonafide Certificate for student ${studentId}...`);
  };
  
  const handleAllocateERP = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status: 'Active' } : s));
    showSuccessMessage(`ERP access allocated for student ${studentId}!`);
  };
  
  // --- Filtered Students (Memoized) ---
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="container elegant-ui">
      {/* --- Modals --- */}
      {isStudentModalOpen && (
        <Modal onClose={handleCloseStudentModal}>
          <StudentForm 
            student={editingStudent}
            onSubmit={handleStudentFormSubmit}
            onClose={handleCloseStudentModal}
          />
        </Modal>
      )}
      
      {feeDetailsStudent && (
        <Modal onClose={() => setFeeDetailsStudent(null)}>
          <div className="fee-form">
            <h2>Fee Details: {feeDetailsStudent.name}</h2>
            <div className="fee-breakdown" style={{background: 'none', border: 'none', padding: 0, marginTop: '1rem'}}>
              <ul>
                <li><span>Total Annual Fees:</span> <strong>₹{feeDetailsStudent.totalFees.toLocaleString()}</strong></li>
                <li className="deduction"><span>Total Fees Paid:</span> <strong>- ₹{feeDetailsStudent.feesPaid.toLocaleString()}</strong></li>
              </ul>
              <hr />
              <div className="final-amount" style={{color: (feeDetailsStudent.totalFees - feeDetailsStudent.feesPaid) > 0 ? '#ef4444' : '#22c55e'}}>
                <span>Amount Due:</span>
                <strong>₹{(feeDetailsStudent.totalFees - feeDetailsStudent.feesPaid).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {/* --- Header --- */}
      <header className="page-header">
        <div>
          <h1>Admission Cell</h1>
          <p className="subtitle">Manage student admissions and records.</p>
        </div>
        <button onClick={logout} className="btn btn-secondary"><span>Logout</span></button>
      </header>
      
      {/* --- Tab Navigation --- */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>
          Enrolled Students ({students.length})
        </button>
        <button className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`} onClick={() => setActiveTab('applicants')}>
          New Applicants ({applicants.length})
        </button>
        <button className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`} onClick={() => setActiveTab('calculator')}>
          Fee Calculator Tool
        </button>
      </div>
      
      {/* --- Success Message Bar --- */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* --- Toolbar (Search & Add) --- */}
      {/* This toolbar is only for the 'directory' tab */}
      {activeTab === 'directory' && (
        <div className="toolbar" style={{marginTop: '1.5rem'}}>
          <input
            type="text"
            placeholder="Search enrolled students by name, ID, or email..."
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => handleOpenStudentModal(null)} className="btn btn-primary" style={{flexShrink: 0, marginLeft: '1rem'}}><span>+</span> Add New Student</button>
        </div>
      )}

      {/* --- Conditional Tab Content --- */}
      <div className="tab-content">
      
        {/* === TAB 1: Enrolled Students === */}
        {activeTab === 'directory' && (
          <div className="student-card-grid">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
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
                  <p><strong>Contact:</strong> {student.email}</p>
                  <p>
                    <strong>Fees:</strong> ₹{student.feesPaid.toLocaleString()} / ₹{student.totalFees.toLocaleString()}
                  </p>
                </div>
                <div className="card-footer">
                  <button onClick={() => setFeeDetailsStudent(student)} className="btn-icon">💰 Fees</button>
                  <button onClick={() => handleIssueDocument(student.id)} className="btn-icon">📄 Docs</button>
                  <button onClick={() => handleOpenStudentModal(student)} className="btn-icon">Edit</button>
                  {student.status === 'Pending ERP' && (
                    <button onClick={() => handleAllocateERP(student.id)} className="btn-icon-success">✓ Allocate ERP</button>
                  )}
                </div>
              </div>
            )) : (
              <div className="content-card full-width" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                <h3>No Students Found</h3>
                <p>No enrolled students match your search term "{searchTerm}".</p>
              </div>
            )}
          </div>
        )}
        
        {/* === TAB 2: New Applicants === */}
        {activeTab === 'applicants' && (
          <div className="content-card full-width">
            <h2>Pending Admission Applications</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Applicant ID</th><th>Name</th><th>Course Applied</th><th>12th Marks</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {applicants.length > 0 ? applicants.map(applicant => (
                    <tr key={applicant.id}>
                      <td>{applicant.id}</td>
                      <td>{applicant.name}</td>
                      <td>{applicant.course}</td>
                      <td>{applicant.marks}%</td>
                      <td className="actions">
                        <button onClick={() => handleApproveApplicant(applicant)} className="btn-icon-success">Approve</button>
                        <button onClick={() => handleRejectApplicant(applicant)} className="btn-icon-danger">Reject</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{textAlign: 'center', color: '#999'}}>No pending applications.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* === TAB 3: Fee Calculator Tool === */}
        {activeTab === 'calculator' && (
          <FeeCalculator />
        )}
      </div>
    </div>
  );
}

export default AdmissionPage;