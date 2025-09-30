import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

// --- Mock Data for both roles ---
// We use a state for student data so it can be updated
const initialStudentFeeData = {
  'S001': { name: 'Rohan Sharma', course: 'Computer Science', totalFees: 80000, feesPaid: 60000 },
  'S002': { name: 'Priya Verma', course: 'Business Admin', totalFees: 75000, feesPaid: 75000 },
  'S003': { name: 'Amit Patel', course: 'Mechanical Engg.', totalFees: 85000, feesPaid: 55000 },
};

const initialTransactions = [
  { id: 'T001', date: '2025-09-28', description: 'Campus Security Services', amount: 150000, type: 'Expense', status: 'Approved' },
  { id: 'T002', date: '2025-09-27', description: 'Student Tuition Fees - CS Batch', amount: 2500000, type: 'Revenue', status: 'Approved' },
  { id: 'T003', date: '2025-09-26', description: 'New Lab Equipment Purchase', amount: 750000, type: 'Expense', status: 'Pending' },
];


// --- Main Page Component ---
function FinancePage() {
  const [activeTab, setActiveTab] = useState('feeCollection'); // Default to the more active tab
  
  // Dashboard State
  const [transactions, setTransactions] = useState(initialTransactions);

  // Fee Collection State
  const [studentFeeData, setStudentFeeData] = useState(initialStudentFeeData);
  const [studentId, setStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [recentFeePayments, setRecentFeePayments] = useState([]);

  // --- Functions for Dashboard ---
  const handleApproval = (transactionId, newStatus) => {
    setTransactions(transactions.map(t => (t.id === transactionId ? { ...t, status: newStatus } : t)));
    alert(`Transaction ${transactionId} has been ${newStatus}.`);
  };
  const handleFlagForAudit = (transactionId) => alert(`Transaction ${transactionId} has been flagged for audit review.`);

  // --- ENHANCED Functions for Fee Collection ---
  const handleSearchStudent = () => {
    const student = studentFeeData[studentId.toUpperCase()];
    if (student) {
      // Pass the student ID along with the data for easier updates
      setSelectedStudent({ ...student, id: studentId.toUpperCase() });
      setPaymentAmount('');
    } else {
      alert('Student ID not found.');
      setSelectedStudent(null);
    }
  };

  const handleFeeSubmission = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const newPayment = {
      receiptId: `R${Date.now()}`,
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      amount,
      date: new Date().toLocaleString(),
    };
    
    // Update the recent payments list
    setRecentFeePayments([newPayment, ...recentFeePayments]);
    
    // Update the main student data state to reflect the payment
    setStudentFeeData(prevData => ({
      ...prevData,
      [selectedStudent.id]: {
        ...prevData[selectedStudent.id],
        feesPaid: prevData[selectedStudent.id].feesPaid + amount,
      },
    }));

    // Reset the form and show a detailed confirmation
    alert(`Payment Successful!\n\nReceipt ID: ${newPayment.receiptId}\nStudent: ${newPayment.studentName}\nAmount Paid: ₹${newPayment.amount.toLocaleString()}`);
    setSelectedStudent(null);
    setStudentId('');
    setPaymentAmount('');
  };

  return (
    <div className="container elegant-ui">
      <header className="page-header">
        <div>
          <h1>Finance Department</h1>
          <p className="subtitle">Unified portal for financial operations.</p>
        </div>
        <Link to="/" className="btn btn-secondary"><span>🏠</span> Back to Home</Link>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          High-Level Dashboard
        </button>
        <button className={`tab-btn ${activeTab === 'feeCollection' ? 'active' : ''}`} onClick={() => setActiveTab('feeCollection')}>
          Accountant Fee Collection
        </button>
      </div>

      {/* Conditional Content */}
      <div className="tab-content">
        {activeTab === 'dashboard' && (
           <div>
            <div className="kpi-grid">
              <div className="kpi-card"><span className="kpi-title">Total Revenue</span><span className="kpi-value">₹25,00,000</span><span className="kpi-delta positive">+5%</span></div>
              <div className="kpi-card"><span className="kpi-title">Total Expenses</span><span className="kpi-value">₹9,85,000</span><span className="kpi-delta negative">+8%</span></div>
              <div className="kpi-card"><span className="kpi-title">Pending Approvals</span><span className="kpi-value">{transactions.filter(t => t.status === 'Pending').length}</span></div>
            </div>
            <div className="content-card">
              <h2>Transactions for Approval</h2>
              <div className="table-container">
                <table>
                  <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id}>
                        <td>{t.date}</td><td>{t.description}</td>
                        <td className={t.type === 'Revenue' ? 'text-positive' : 'text-negative'}>₹{t.amount.toLocaleString()}</td>
                        <td>{t.type}</td><td><span className={`status ${t.status.toLowerCase()}`}>{t.status}</span></td>
                        <td className="actions">
                          {t.status === 'Pending' && (<><button onClick={() => handleApproval(t.id, 'Approved')} className="btn-icon-success">✓</button><button onClick={() => handleApproval(t.id, 'Rejected')} className="btn-icon-danger">×</button></>)}
                          <button onClick={() => handleFlagForAudit(t.id)} className="btn-icon">🚩</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feeCollection' && (
          <div className="content-grid-single">
            <div className="content-card">
              <h2>Submit Student Fee</h2>
              <div className="search-student-form">
                <input type="text" placeholder="Enter Student ID (e.g., S001)" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="search-input" />
                <button onClick={handleSearchStudent} className="btn btn-primary">Search Student</button>
              </div>
              {selectedStudent && (
                <form onSubmit={handleFeeSubmission} className="fee-submission-form">
                  <div className="student-details-box">
                    <h3>Student Details</h3>
                    <p><strong>Name:</strong> {selectedStudent.name}</p>
                    <p><strong>Total Fees:</strong> ₹{selectedStudent.totalFees.toLocaleString()}</p>
                    <p><strong>Fees Paid:</strong> ₹{selectedStudent.feesPaid.toLocaleString()}</p>
                    <p className="fee-due"><strong>Amount Due:</strong> ₹{(selectedStudent.totalFees - selectedStudent.feesPaid).toLocaleString()}</p>
                  </div>
                  <div className="payment-input-group">
                    <label>Enter Payment Amount (₹)</label>
                    <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="e.g., 20000" required />
                    <button type="submit" className="btn btn-success">Confirm & Generate Receipt</button>
                  </div>
                </form>
              )}
            </div>
            <div className="content-card">
              <h2>Recent Fee Submissions</h2>
              <div className="table-container">
                <table>
                  <thead><tr><th>Receipt ID</th><th>Student Name</th><th>Amount Paid</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentFeePayments.length > 0 ? recentFeePayments.map(t => (
                      <tr key={t.receiptId}>
                        <td>{t.receiptId}</td><td>{t.studentName}</td>
                        <td className="text-positive">₹{t.amount.toLocaleString()}</td><td>{t.date}</td>
                      </tr>
                    )) : (<tr><td colSpan="4" style={{textAlign: 'center', color: '#999'}}>No recent payments processed</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancePage;