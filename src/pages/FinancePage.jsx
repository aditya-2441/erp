import React, { useState, useMemo } from 'react';
import '../styles.css';
import { useAuth } from '../context/AuthContext'; // Needed for context

// --- Components (Modal, TransactionForm - unchanged) ---
const Modal = ({ children, onClose }) => ( <div className="modal-backdrop"> <div className="modal-content"> <button onClick={onClose} className="modal-close-btn">&times;</button> {children} </div> </div> );
const TransactionForm = ({ onSubmit, onClose }) => { const [formData, setFormData] = useState({ description: '', amount: '', type: 'Expense', date: new Date().toISOString().split('T')[0], }); const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }; const handleSubmit = (e) => { e.preventDefault(); const newTransaction = { ...formData, amount: parseFloat(formData.amount) || 0, id: `T${Date.now() % 10000}`, status: 'Pending', }; onSubmit(newTransaction); onClose(); }; return ( <form onSubmit={handleSubmit} className="fee-form"> <h2>Add New Transaction</h2> <p>Submit a new revenue or expense item for approval.</p> <div className="form-grid-single-col"> <label>Description <input type="text" name="description" value={formData.description} onChange={handleChange} required /> </label> <div className="form-grid"> <label>Amount (₹) <input type="number" name="amount" value={formData.amount} onChange={handleChange} required /> </label> <label>Type <select name="type" value={formData.type} onChange={handleChange}> <option value="Expense">Expense</option> <option value="Revenue">Revenue</option> </select> </label> </div> <label>Date <input type="date" name="date" value={formData.date} onChange={handleChange} required /> </label> </div> <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}> Submit for Approval </button> </form> ); };

// --- Dashboard Chart Component ---
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

// --- Activity Feed Component ---
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

// --- Main Page Component ---
function FinancePage() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [successMessage, setSuccessMessage] = useState('');

  // --- State ---
  const [studentFeeData, setStudentFeeData] = useState({ 'S001': { name: 'Rohan Sharma', course: 'Computer Science', totalFees: 80000, feesPaid: 60000 }, 'S002': { name: 'Priya Verma', course: 'Business Admin', totalFees: 75000, feesPaid: 75000 }, 'S003': { name: 'Amit Patel', course: 'Mechanical Engg.', totalFees: 85000, feesPaid: 55000 }, });
  const [transactions, setTransactions] = useState([ { id: 'T001', date: '2025-09-28', description: 'Campus Security Services', amount: 150000, type: 'Expense', status: 'Approved' }, { id: 'T002', date: '2025-09-27', description: 'Student Tuition Fees - CS Batch', amount: 2500000, type: 'Revenue', status: 'Approved' }, { id: 'T003', date: '2025-09-26', description: 'New Lab Equipment Purchase', amount: 750000, type: 'Expense', status: 'Pending' }, ]);
  const [budgets, setBudgets] = useState([ { id: 'B01', department: 'Computer Science', allocated: 5000000, spent: 3200000 }, { id: 'B02', department: 'Administration', allocated: 2500000, spent: 2450000 }, { id: 'B03', department: 'Library', allocated: 1200000, spent: 850000 }, ]);
  const [activities, setActivities] = useState([]); 
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // --- Utilities ---
  const showSuccessMessage = (message) => { setSuccessMessage(message); setTimeout(() => setSuccessMessage(''), 3000); };
  const addActivity = (type, message) => { const newActivity = { type, message, date: new Date().toLocaleString() }; setActivities(prev => [newActivity, ...prev]); };

  // --- Handlers ---
  const handleApproval = (transactionId, newStatus) => { setTransactions(transactions.map(t => (t.id === transactionId ? { ...t, status: newStatus } : t))); showSuccessMessage(`Transaction ${transactionId} ${newStatus}.`); if (newStatus === 'Approved') addActivity('success', `Approved transaction ${transactionId}.`); if (newStatus === 'Rejected') addActivity('danger', `Rejected transaction ${transactionId}.`); };
  const handleFlagForAudit = (transactionId) => { setTransactions(transactions.map(t => (t.id === transactionId ? { ...t, status: 'Flagged for Audit' } : t))); showSuccessMessage(`Transaction ${transactionId} flagged.`); addActivity('warning', `Flagged transaction ${transactionId} for audit.`); };
  const handleAddTransaction = (newTx) => { setTransactions(prev => [newTx, ...prev]); showSuccessMessage(`Transaction submitted.`); addActivity('info', `New transaction submitted: ${newTx.description}`); };
  const handleSearchStudent = () => { const student = studentFeeData[studentId.toUpperCase()]; if (student) { setSelectedStudent({ ...student, id: studentId.toUpperCase() }); setPaymentAmount(''); } else { alert('Student ID not found.'); setSelectedStudent(null); } };
  const handleFeeSubmission = (e) => { e.preventDefault(); const amount = parseFloat(paymentAmount); if (!amount || amount <= 0) { alert('Invalid payment amount.'); return; } const remaining = selectedStudent.totalFees - selectedStudent.feesPaid; if (amount > remaining) { alert(`Payment exceeds amount due (₹${remaining.toLocaleString()}).`); return; } setStudentFeeData(prevData => ({ ...prevData, [selectedStudent.id]: { ...prevData[selectedStudent.id], feesPaid: prevData[selectedStudent.id].feesPaid + amount, }, })); const newPayment = { receiptId: `R${Date.now() % 10000}`, studentName: selectedStudent.name, studentId: selectedStudent.id, amount, date: new Date().toLocaleString(), }; addActivity('payment', `Fee payment of ₹${amount.toLocaleString()} received from ${selectedStudent.name}.`); showSuccessMessage(`Payment received from ${newPayment.studentName}.`); setSelectedStudent(null); setStudentId(''); setPaymentAmount(''); };
  
  // --- KPIs ---
  const kpi = useMemo(() => {
    const approvedTx = transactions.filter(t => t.status === 'Approved');
    const totalRevenue = approvedTx.filter(t => t.type === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = approvedTx.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const pendingApprovals = transactions.filter(t => t.status === 'Pending').length;
    return { totalRevenue, totalExpenses, pendingApprovals, net: totalRevenue - totalExpenses };
  }, [transactions]);
  
  return (
    <>
      {/* --- Modals --- */}
      {isTxModalOpen && ( <Modal onClose={() => setIsTxModalOpen(false)}> <TransactionForm onSubmit={handleAddTransaction} onClose={() => setIsTxModalOpen(false)} /> </Modal> )}

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
      
        {/* === TAB 1: Dashboard === */}
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
        
        {/* === TAB 2: Transactions === */}
        {activeTab === 'transactions' && (
            <div className="content-card full-width">
              <div className="toolbar">
                {/* No h2 needed */}
                <input type="text" placeholder="Search transactions..." className="search-input" /> 
                <button onClick={() => setIsTxModalOpen(true)} className="btn btn-primary"><span>➕</span> Add Transaction</button>
              </div>
              <div className="table-container">
                <table>
                  <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {transactions.length > 0 ? transactions.map(t => (
                      <tr key={t.id}>
                        <td>{t.date}</td><td>{t.description}</td>
                        <td style={{color: t.type === 'Revenue' ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                          {t.type === 'Revenue' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                        </td>
                        <td>{t.type}</td><td><span className={`status ${t.status.toLowerCase().replace(/ /g, '-')}`}>{t.status}</span></td>
                        <td className="actions">
                          {t.status === 'Pending' && (<>
                            <button onClick={() => handleApproval(t.id, 'Approved')} className="btn-icon-success" title="Approve">✔️</button>
                            <button onClick={() => handleApproval(t.id, 'Rejected')} className="btn-icon-danger" title="Reject">❌</button>
                          </>)}
                          {t.status !== 'Flagged for Audit' && (
                            <button onClick={() => handleFlagForAudit(t.id)} className="btn-icon" title="Flag for Audit">🚩</button>
                          )}
                          {/* Add Edit/Delete icons? */}
                        </td>
                      </tr>
                    )) : (<tr><td colSpan="6" style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem'}}>No transactions found.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* === TAB 3: Fee Collection === */}
        {activeTab === 'feeCollection' && (
          <div className="content-grid-admin">
            <div className="content-card">
              <h2>Submit Student Fee</h2>
              <div className="toolbar" style={{padding: 0, marginBottom: '1.5rem'}}>
                <input type="text" placeholder="Enter Student ID (e.g., S001)" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="search-input" style={{flexGrow: 1, marginRight: '1rem'}} />
                <button onClick={handleSearchStudent} className="btn btn-primary">Search</button>
              </div>
              {selectedStudent && (
                <form onSubmit={handleFeeSubmission} className="fee-form" style={{marginTop: '1.5rem'}}>
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
                  
                  <div className="form-grid">
                    <label>Payment Amount (₹)
                      <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount received" required />
                    </label>
                    <button type="submit" className="btn btn-success" style={{alignSelf: 'end'}}>Confirm Payment</button>
                  </div>
                </form>
              )}
            </div>
            <div className="content-card">
              <h2>Student Fee Status</h2>
              <div className="table-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
                 <table>
                  <thead><tr><th>Student</th><th>Amount Due (₹)</th><th>Status</th></tr></thead>
                  <tbody>
                    {Object.values(studentFeeData).map(s => {
                      const due = s.totalFees - s.feesPaid;
                      return (
                        <tr key={s.id}>
                          <td>{s.name}<br/><span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{s.id}</span></td>
                          <td style={{color: due > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '600'}}>
                            ₹{due.toLocaleString()}
                          </td>
                          <td>
                            <span className={`status ${due > 0 ? 'pending' : 'approved'}`}>{due > 0 ? 'Pending' : 'Paid'}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                 </table>
              </div>
            </div>
          </div>
        )}
        
        {/* === TAB 4: Budget & Planning === */}
        {activeTab === 'budgets' && (
          <div className="content-card full-width">
            <div className="toolbar">
              <h2>Departmental Budgets</h2>
              <button className="btn btn-primary" disabled><span>➕</span> Add New Budget</button>
            </div>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {budgets.map(b => (
                <li key={b.id} style={{padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-hover)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center'}}>
                    <span style={{fontSize: '1.1rem', fontWeight: 600}}>{b.department}</span>
                    <span style={{fontSize: '1rem'}}>
                      <strong>₹{b.spent.toLocaleString()}</strong> / <span style={{color: 'var(--text-secondary)'}}>₹{b.allocated.toLocaleString()}</span>
                    </span>
                  </div>
                  <div style={{width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', marginTop: '1rem', overflow: 'hidden'}}>
                    <div style={{height: '100%', backgroundColor: 'var(--primary)', borderRadius: '5px', width:`${(b.spent / b.allocated) * 100}%`}}></div>
                  </div>
                  <div style={{textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>
                    {((b.spent / b.allocated) * 100).toFixed(1)}% Utilized
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default FinancePage;