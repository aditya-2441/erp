import React, { useState, useMemo } from 'react';
import '../styles.css';
import { useAuth } from '../context/AuthContext'; // Needed for context

// --- *** UPDATED TransactionForm Component *** ---
// Now accepts 'budgets' prop to build a department dropdown
const TransactionForm = ({ onSubmit, onClose, budgets }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0],
    department: budgets[0]?.department || '', // Default to first budget
    transactionId: '', // NEW
    receiptId: '',     // NEW
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      internalId: `T${Date.now() % 10000}`, // Use internalId
      status: 'Pending',
    };
    onSubmit(newTransaction);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="fee-form">
      <h2>Add New Transaction</h2>
      <p>Submit a new revenue or expense item for approval.</p>
      
      <label>Description
        <input typeM="text" name="description" value={formData.description} onChange={handleChange} required />
      </label>

      <div className="form-grid" style={{marginTop: '1.25rem'}}>
        <label>Amount (₹)
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </label>
        <label>Type
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
          </select>
        </label>
        
        {/* Only show department for Expenses */}
        {formData.type === 'Expense' && (
          <label>Department
            <select name="department" value={formData.department} onChange={handleChange}>
              {budgets.map(b => (
                <option key={b.id} value={b.department}>{b.department}</option>
              ))}
              <option value="General">General</option>
            </select>
          </label>
        )}
        
        <label>Date
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>
        
        <label>External Transaction ID / UTR
          <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="e.g., UTR12345" />
        </label>
        <label>Receipt/Invoice ID
          <input type="text" name="receiptId" value={formData.receiptId} onChange={handleChange} placeholder="e.g., INV-987" />
        </label>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
        Submit for Approval
      </button>
    </form>
  );
};


// --- Modal Component (unchanged) ---
const Modal = ({ children, onClose }) => ( <div className="modal-backdrop"> <div className="modal-content"> <button onClick={onClose} className="modal-close-btn">&times;</button> {children} </div> </div> );

// --- Dashboard Chart Component (unchanged) ---
const FinanceChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'Approved');
    const revenue = approved.filter(t => t.type === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
    const expenses = approved.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const maxVal = Math.max(revenue, expenses, 1); 
    return [
      { name: 'Revenue', value: revenue, height: (revenue / maxVal) * 100, color: 'var(--success)' },
      { name: 'Expenses', value: expenses, height: (expenses / maxVal) * 100, color: 'var(--danger)' },
    ];
  }, [transactions]);
  return (
    <div className="chart-container">
      <div className="chart-title">Total Revenue vs. Expenses (Approved)</div>
      <div className="bar-chart">
        {chartData.map(d => (
          <div key={d.name} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="bar" style={{ height: `${d.height}%`, backgroundColor: d.color }}>
              ₹{d.value.toLocaleString('en-IN', { notation: 'compact' })}
            </div>
            <div className="bar-label">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Activity Feed Component (unchanged) ---
const ActivityFeed = ({ activities }) => (
  <div className="content-card">
    <h2 style={{borderBottom: 'none', paddingBottom: 0, marginBottom: '1.5rem'}}>Recent Activity</h2>
    <ul className="activity-feed">
      {activities.length === 0 && <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0'}}>No recent activity logged.</p>}
      {activities.slice(0, 5).map((act, index) => (
        <li key={index} className="activity-item">
          <div className={`activity-icon ${act.type}`}>
            {act.type === 'success' && '✓'}
            {act.type === 'danger' && '×'}
            {act.type === 'warning' && '🚩'}
            {act.type === 'info' && '➕'}
             {act.type === 'payment' && '💰'}
          </div>
          <div className="activity-content">
            <p>{act.message}</p>
            <span>{act.date}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// --- *** DATA MOCKUP (UPDATED) *** ---

// --- Student Fee Data (from previous step) ---
const initialStudentData = {
  'S001': { name: 'Rohan Sharma', course: 'Computer Science', totalFees: 80000 },
  'S002': { name: 'Priya Verma', course: 'Business Admin', totalFees: 75000 },
  'S003': { name: 'Amit Patel', course: 'Mechanical Engg.', totalFees: 85000 },
};
const initialPaymentHistory = {
  'S001': [{ id: 'R1001', utr: 'UTR123456ABC', amount: 60000, date: '2024-07-15' }],
  'S002': [{ id: 'R1002', utr: 'UTR789012XYZ', amount: 75000, date: '2024-07-16' }],
  'S003': [
    { id: 'R1003', utr: 'UTR345678DEF', amount: 40000, date: '2024-07-17' },
    { id: 'R1004', utr: 'UTR901234GHI', amount: 15000, date: '2024-09-05' },
  ],
};
const getTotalPaid = (history, studentId) => {
  return history[studentId]?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
};

// --- General Ledger Transactions (NEWLY UPDATED) ---
const initialTransactions = [
  { internalId: 'T001', date: '2025-09-28', description: 'Campus Security Services', amount: 150000, type: 'Expense', status: 'Approved', department: 'Administration', transactionId: 'UTR_SEC_456', receiptId: 'REC_SEC_123' },
  { internalId: 'T002', date: '2025-09-27', description: 'Student Tuition Fees - CS Batch', amount: 2500000, type: 'Revenue', status: 'Approved', department: 'Revenue', transactionId: 'FEE_BATCH_001', receiptId: 'N/A' },
  { internalId: 'T003', date: '2025-09-26', description: 'New Lab Equipment Purchase', amount: 750000, type: 'Expense', status: 'Pending', department: 'Computer Science', transactionId: 'UTR_DELL_789', receiptId: 'INV_DELL_987' },
  { internalId: 'T004', date: '2025-09-25', description: 'Library Journal Subscriptions', amount: 85000, type: 'Expense', status: 'Approved', department: 'Library', transactionId: 'UTR_JOURNAL_111', receiptId: 'REC_JOURNAL_222' },
];

// --- Department Budgets (UPDATED - 'spent' is removed) ---
const initialBudgets = [
    { id: 'B01', department: 'Computer Science', allocated: 5000000 },
    { id: 'B02', department: 'Administration', allocated: 2500000 },
    { id: 'B03', department: 'Library', allocated: 1200000 },
];

// --- Main Page Component ---
function FinancePage() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [successMessage, setSuccessMessage] = useState('');

  // --- State ---
  const [studentData, setStudentData] = useState(initialStudentData);
  const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);
  const [transactions, setTransactions] = useState(initialTransactions);
  // 'budgets' state now only holds the allocation. 'spent' will be calculated.
  const [budgets, setBudgets] = useState(initialBudgets);
  const [activities, setActivities] = useState([]); 
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  // Fee Collection State
  const [studentId, setStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [utrId, setUtrId] = useState(''); 

  // --- Utilities ---
  const showSuccessMessage = (message) => { setSuccessMessage(message); setTimeout(() => setSuccessMessage(''), 3000); };
  const addActivity = (type, message) => { const newActivity = { type, message, date: new Date().toLocaleString() }; setActivities(prev => [newActivity, ...prev]); };

  // --- Handlers ---
  const handleApproval = (internalId, newStatus) => {
    setTransactions(transactions.map(t => (t.internalId === internalId ? { ...t, status: newStatus } : t)));
    showSuccessMessage(`Transaction ${internalId} ${newStatus}.`);
    if (newStatus === 'Approved') addActivity('success', `Approved transaction ${internalId}.`);
    if (newStatus === 'Rejected') addActivity('danger', `Rejected transaction ${internalId}.`);
  };
  const handleFlagForAudit = (internalId) => {
    setTransactions(transactions.map(t => (t.internalId === internalId ? { ...t, status: 'Flagged for Audit' } : t)));
    showSuccessMessage(`Transaction ${internalId} flagged.`);
    addActivity('warning', `Flagged transaction ${internalId} for audit.`);
  };
  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
    showSuccessMessage(`Transaction submitted.`);
    addActivity('info', `New transaction submitted: ${newTx.description}`);
  };

  // Student Fee Handlers (unchanged from previous)
  const handleSearchStudent = () => {
    const id = studentId.toUpperCase();
    const student = studentData[id];
    if (student) {
      const payments = paymentHistory[id] || [];
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      setSelectedStudent({ ...student, id: id, feesPaid: totalPaid, payments: payments });
      setPaymentAmount(''); setUtrId('');
    } else {
      alert('Student ID not found.'); setSelectedStudent(null);
    }
  };
  const handleFeeSubmission = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) { alert('Invalid payment amount.'); return; }
    if (!utrId.trim()) { alert('Please enter a UTR ID for the transaction.'); return; }
    const remaining = selectedStudent.totalFees - selectedStudent.feesPaid;
    if (amount > remaining) { alert(`Payment exceeds amount due (₹${remaining.toLocaleString()}).`); return; }
    const newPayment = { id: `R${Date.now() % 10000}`, utr: utrId, amount: amount, date: new Date().toISOString().split('T')[0] };
    setPaymentHistory(prevHistory => {
      const currentPayments = prevHistory[selectedStudent.id] || [];
      return { ...prevHistory, [selectedStudent.id]: [...currentPayments, newPayment] };
    });
    addActivity('payment', `Fee payment of ₹${amount.toLocaleString()} received from ${selectedStudent.name}. Receipt: ${newPayment.id}`);
    showSuccessMessage(`Payment received from ${selectedStudent.name}.`);
    handleSearchStudent(); // Refresh student data
    setPaymentAmount(''); setUtrId('');
  };
  
  // --- *** KPIs & Derived Data (UPDATED) *** ---
  
  // KPIs for Dashboard
  const kpi = useMemo(() => {
    const approvedTx = transactions.filter(t => t.status === 'Approved');
    const totalRevenue = approvedTx.filter(t => t.type === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = approvedTx.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const pendingApprovals = transactions.filter(t => t.status === 'Pending').length;
    return { totalRevenue, totalExpenses, pendingApprovals, net: totalRevenue - totalExpenses };
  }, [transactions]);
  
  // Student Fee Status for Fee Collection tab
  const studentFeeStatus = useMemo(() => {
    return Object.keys(studentData).map(id => {
      const student = studentData[id];
      const totalPaid = getTotalPaid(paymentHistory, id);
      const due = student.totalFees - totalPaid;
      return { id, name: student.name, due };
    });
  }, [studentData, paymentHistory]);

  // NEW: Processed Budgets for Budget tab
  const processedBudgets = useMemo(() => {
    // Get all approved expenses
    const approvedExpenses = transactions.filter(
      t => t.type === 'Expense' && t.status === 'Approved'
    );
    
    // Calculate spent amount for each budget
    return budgets.map(budget => {
      const spent = approvedExpenses
        .filter(t => t.department === budget.department)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
  }, [budgets, transactions]);
  // --- *** END OF DERIVED DATA *** ---

  
  return (
    <>
      {/* --- Modals --- */}
      {isTxModalOpen && (
        <Modal onClose={() => setIsTxModalOpen(false)}>
          {/* Pass budgets to the form */}
          <TransactionForm 
            onSubmit={handleAddTransaction} 
            onClose={() => setIsTxModalOpen(false)}
            budgets={budgets} 
          />
        </Modal> 
      )}

      {/* --- Tab Navigation --- */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}> 📊 Dashboard </button>
        <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}> 📑 Transactions ({kpi.pendingApprovals} Pending) </button>
        <button className={`tab-btn ${activeTab === 'feeCollection' ? 'active' : ''}`} onClick={() => setActiveTab('feeCollection')}> 💰 Fee Collection </button>
        <button className={`tab-btn ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')}> 🏦 Budget & Planning </button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* --- Conditional Content --- */}
      <div className="tab-content" style={{marginTop: '1.5rem'}}>
      
        {/* === TAB 1: Dashboard (unchanged) === */}
        {activeTab === 'dashboard' && (
           <>
            <div className="kpi-grid">
              <div className="kpi-card kpi-positive"><span className="kpi-title"><span>📈</span> Total Revenue</span><span className="kpi-value">₹{kpi.totalRevenue.toLocaleString()}</span><span className="kpi-delta positive">+5% vs last month</span></div>
              <div className="kpi-card kpi-negative"><span className="kpi-title"><span>📉</span> Total Expenses</span><span className="kpi-value">₹{kpi.totalExpenses.toLocaleString()}</span><span className="kpi-delta negative">+8% vs last month</span></div>
              <div className={`kpi-card ${kpi.net >= 0 ? 'kpi-positive' : 'kpi-negative'}`}><span className="kpi-title"><span>💰</span> Net Income</span><span className="kpi-value">₹{kpi.net.toLocaleString()}</span><span className={`kpi-delta ${kpi.net >= 0 ? 'positive' : 'negative'}`}>{kpi.net >= 0 ? 'Profit' : 'Loss'}</span></div>
              <div className="kpi-card kpi-warning"><span className="kpi-title"><span>⏳</span> Pending Approvals</span><span className="kpi-value">{kpi.pendingApprovals}</span><span className="kpi-delta">Item(s)</span></div>
            </div>
            <div className="content-grid-2-1">
              <div className="content-card">
                <FinanceChart transactions={transactions} />
              </div>
              <ActivityFeed activities={activities} />
            </div>
          </>
        )}
        
        {/* === TAB 2: Transactions (*** UPDATED ***) === */}
        {activeTab === 'transactions' && (
            <div className="content-card full-width">
              <div className="toolbar">
                <input type="text" placeholder="Search transactions..." className="search-input" /> 
                <button onClick={() => setIsTxModalOpen(true)} className="btn btn-primary"><span>➕</span> Add Transaction</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction Details</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? transactions.map(t => (
                      <tr key={t.internalId}>
                        <td>
                          <div style={{fontWeight: 600}}>{t.description}</div>
                          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                            {t.type === 'Expense' && `Dept: ${t.department}`}
                            {t.transactionId && ` | UTR: ${t.transactionId}`}
                            {t.receiptId && ` | Receipt: ${t.receiptId}`}
                          </div>
                        </td>
                        <td>{t.date}</td>
                        <td style={{color: t.type === 'Revenue' ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                          {t.type === 'Revenue' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                        </td>
                        <td>{t.type}</td>
                        <td><span className={`status ${t.status.toLowerCase().replace(/ /g, '-')}`}>{t.status}</span></td>
                        <td className="actions">
                          {t.status === 'Pending' && (<>
                            <button onClick={() => handleApproval(t.internalId, 'Approved')} className="btn-icon-success" title="Approve">✔️</button>
                            <button onClick={() => handleApproval(t.internalId, 'Rejected')} className="btn-icon-danger" title="Reject">❌</button>
                          </>)}
                          {t.status !== 'Flagged for Audit' && (
                            <button onClick={() => handleFlagForAudit(t.internalId)} className="btn-icon" title="Flag for Audit">🚩</button>
                          )}
                        </td>
                      </tr>
                    )) : (<tr><td colSpan="6" style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem'}}>No transactions found.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* === TAB 3: Fee Collection (unchanged from previous) === */}
        {activeTab === 'feeCollection' && (
          <div className="content-grid-admin">
            <div className="content-card">
              <h2>Submit Student Fee</h2>
              <div className="toolbar" style={{padding: 0, marginBottom: '1.5rem'}}>
                <input type="text" placeholder="Enter Student ID (e.g., S001)" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="search-input" style={{flexGrow: 1, marginRight: '1rem'}} />
                <button onClick={handleSearchStudent} className="btn btn-primary">Search</button>
              </div>
              
              {selectedStudent && (
                <>
                  {/* Student Info Card */}
                  <div style={{border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backgroundColor: 'var(--bg-hover)', marginBottom: '1.5rem'}}>
                    <h3>{selectedStudent.name} ({selectedStudent.id})</h3>
                    <p style={{color: 'var(--text-secondary)'}}><strong>Course:</strong> {selectedStudent.course}</p>
                    <hr style={{border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0'}} />
                    <div className="fee-breakdown" style={{padding: 0, border: 'none', background: 'none', marginTop: 0}}>
                      <ul>
                        <li><span>Total Fees:</span> <strong>₹{selectedStudent.totalFees.toLocaleString()}</strong></li>
                        <li className="deduction"><span>Fees Paid:</span> <strong>- ₹{selectedStudent.feesPaid.toLocaleString()}</strong></li>
                      </ul>
                      <hr />
                      <div className="final-amount" style={{color: (selectedStudent.totalFees - selectedStudent.feesPaid) > 0 ? 'var(--danger)' : 'var(--success)'}}>
                        <span>Amount Due:</span>
                        <strong>₹{(selectedStudent.totalFees - selectedStudent.feesPaid).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                  
                  {/* New Payment Form */}
                  <form onSubmit={handleFeeSubmission} className="fee-form" style={{marginTop: '1.5rem'}}>
                    <h4>Add New Payment</h4>
                    <div className="form-grid">
                      <label>Payment Amount (₹)
                        <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount received" required />
                      </label>
                      <label>UTR ID / Transaction ID
                        <input type="text" value={utrId} onChange={(e) => setUtrId(e.target.value)} placeholder="Enter UTR ID" required />
                      </label>
                    </div>
                    <button type="submit" className="btn btn-success" style={{width: '100%', marginTop: '1rem'}}>Confirm Payment</button>
                  </form>

                  {/* Payment History Table */}
                  <div className="payment-history" style={{marginTop: '2rem'}}>
                    <h3>Payment History</h3>
                    {selectedStudent.payments.length > 0 ? (
                      <div className="table-container">
                        <table>
                          <thead><tr><th>Receipt ID</th><th>Date</th><th>UTR ID</th><th>Amount (₹)</th></tr></thead>
                          <tbody>
                            {selectedStudent.payments.map(p => (
                              <tr key={p.id}>
                                <td>{p.id}</td><td>{p.date}</td><td>{p.utr}</td><td><strong>₹{p.amount.toLocaleString()}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', background: 'var(--bg-hover)', borderRadius: 'var(--radius)'}}>
                        No past payments found for this student.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Student Fee Status Card */}
            <div className="content-card">
              <h2>Student Fee Status</h2>
              <div className="table-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
                 <table>
                  <thead><tr><th>Student</th><th>Amount Due (₹)</th><th>Status</th></tr></thead>
                  <tbody>
                    {studentFeeStatus.map(s => (
                        <tr key={s.id}>
                          <td>{s.name}<br/><span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{s.id}</span></td>
                          <td style={{color: s.due > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '600'}}>
                            ₹{s.due.toLocaleString()}
                          </td>
                          <td>
                            <span className={`status ${s.due > 0 ? 'pending' : 'approved'}`}>{s.due > 0 ? 'Pending' : 'Paid'}</span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                 </table>
              </div>
            </div>
          </div>
        )}
        
        {/* === TAB 4: Budget & Planning (*** UPDATED ***) === */}
        {activeTab === 'budgets' && (
          <div className="content-card full-width">
            <div className="toolbar">
              <h2>Departmental Budgets (Live)</h2>
              <button className="btn btn-primary" disabled><span>➕</span> Add New Budget</button>
            </div>
            <p style={{marginTop: 0, color: 'var(--text-secondary)'}}>
              Budget utilization is now calculated automatically from approved expenses in the 'Transactions' tab.
            </p>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {/* Iterate over the DYNAMICALLY calculated processedBudgets */}
              {processedBudgets.map(b => {
                const utilization = (b.spent / b.allocated) * 100;
                let barColor = 'var(--primary)';
                if (utilization > 90) barColor = 'var(--danger)';
                else if (utilization > 75) barColor = 'var(--warning)';

                return (
                  <li key={b.id} style={{padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-hover)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center'}}>
                      <span style={{fontSize: '1.1rem', fontWeight: 600}}>{b.department}</span>
                      <span style={{fontSize: '1rem'}}>
                        <strong>₹{b.spent.toLocaleString()}</strong> / <span style={{color: 'var(--text-secondary)'}}>₹{b.allocated.toLocaleString()}</span>
                      </span>
                    </div>
                    <div style={{width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', marginTop: '1rem', overflow: 'hidden'}}>
                      <div style={{height: '100%', backgroundColor: barColor, borderRadius: '5px', width:`${utilization}%`, transition: 'width 0.5s ease'}}></div>
                    </div>
                    <div style={{textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>
                      {utilization.toFixed(1)}% Utilized
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default FinancePage;