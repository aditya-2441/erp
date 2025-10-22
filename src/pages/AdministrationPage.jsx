import React, { useState, useMemo } from 'react';
import '../styles.css';
import { rolesData } from '../data/rolesData';
import { useAuth } from '../context/AuthContext'; // Needed for context

// --- Mock Data ---
const initialStaffMembers = [
    { id: 'E01', name: 'Dr. Anjali Sharma', department: 'Computer Science', role: 'Head of Department', status: 'Active', email: 'anjali.sharma@univ.edu', phone: '9876543210', joinDate: '2018-07-01', salary: 1500000 },
    { id: 'E02', name: 'Prof. Vikram Singh', department: 'Mechanical Engg.', role: 'Professor', status: 'Active', email: 'vikram.singh@univ.edu', phone: '9876543211', joinDate: '2015-03-12', salary: 1200000 },
    { id: 'E03', name: 'Meera Desai', department: 'Admissions', role: 'Admissions Officer', status: 'Active', email: 'meera.desai@univ.edu', phone: '9876543212', joinDate: '2020-05-20', salary: 700000 },
    { id: 'E04', name: 'Sanjay Gupta', department: 'Finance', role: 'Chief Financial Officer', status: 'On Leave', email: 'sanjay.gupta@univ.edu', phone: '9876543213', joinDate: '2012-11-01', salary: 2000000 },
    { id: 'E05', name: 'Rajesh Kumar', department: 'Administration', role: 'Top Administration', status: 'Active', email: 'rajesh.kumar@univ.edu', phone: '9876543214', joinDate: '2010-02-15', salary: 1800000 },
    { id: 'E06', name: 'Priya Mehta', department: 'Finance', role: 'Accountant', status: 'Active', email: 'priya.mehta@univ.edu', phone: '9876543215', joinDate: '2021-08-30', salary: 650000 },
];
const initialHiringPipeline = [
    { id: 'H01', role: 'Assistant Professor, CS', candidates: 5, stage: 'Interview' },
    { id: 'H02', role: 'Lab Technician', candidates: 12, stage: 'Screening' },
    { id: 'H03', role: 'Placement Coordinator', candidates: 3, stage: 'Offer Released' },
];
const initialBudgets = [
    { id: 'B01', department: 'Computer Science', allocated: 5000000, spent: 3200000 },
    { id: 'B02', department: 'Administration', allocated: 2500000, spent: 2450000 },
    { id: 'B03', department: 'Library', allocated: 1200000, spent: 850000 },
    { id: 'B04', department: 'Placements', allocated: 1500000, spent: 750000 },
];

// --- Components (Modal, Form, RoleCard - unchanged) ---
// These should be correct from the previous step.
const Modal = ({ children, onClose }) => ( <div className="modal-backdrop"> <div className="modal-content"> <button onClick={onClose} className="modal-close-btn">&times;</button> {children} </div> </div> );
const StaffForm = ({ staff, onSubmit, onClose }) => { const isEditing = !!staff; const [formData, setFormData] = useState({ name: staff?.name || '', department: staff?.department || 'Administration', role: staff?.role || '', email: staff?.email || '', phone: staff?.phone || '', salary: staff?.salary || '', status: staff?.status || 'Active', joinDate: staff?.joinDate || new Date().toISOString().split('T')[0], }); const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }; const handleSubmit = (e) => { e.preventDefault(); const finalData = { ...formData, salary: parseFloat(formData.salary) || 0, id: isEditing ? staff.id : `E${Date.now() % 1000}`, }; onSubmit(finalData); onClose(); }; return ( <form onSubmit={handleSubmit} className="fee-form"> <h2>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h2> <div className="form-grid"> <label>Full Name <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label> <label>Email Address <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label> <label>Phone Number <input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></label> <label>Join Date <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} /></label> <label>Department <select name="department" value={formData.department} onChange={handleChange}> <option value="Administration">Administration</option> <option value="Finance">Finance</option> <option value="Admissions">Admissions</option> <option value="Computer Science">Computer Science</option> <option value="Mechanical Engg.">Mechanical Engg.</option> <option value="Library">Library</option> <option value="Placements">Placements</option> </select> </label> <label>Role <input type="text" name="role" value={formData.role} onChange={handleChange} required /></label> <label>Annual Salary (₹) <input type="number" name="salary" value={formData.salary} onChange={handleChange} /></label> <label>Status <select name="status" value={formData.status} onChange={handleChange}> <option value="Active">Active</option> <option value="On Leave">On Leave</option> <option value="Terminated">Terminated</option> </select> </label> </div> <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}> {isEditing ? 'Save Changes' : 'Create Staff Member'} </button> </form> ); };
const RoleCard = ({ data, onSelectRole }) => ( <div className="content-card"> <h2>{data.name}</h2> <p>{data.description}</p> {data.levels && data.levels.map(level => ( <div key={level.name} style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}> <h3 style={{marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary)'}}>{level.name}</h3> {level.roles && ( <ul style={{margin: 0, paddingLeft: '20px'}}> {level.roles.map(role => ( <li key={role.title} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}> <span> <strong>{role.title}</strong> {role.reportsTo ? <span style={{color: 'var(--text-secondary)'}}> (Reports to: {role.reportsTo})</span> : ''} </span> <button className="btn-icon" onClick={() => onSelectRole(role.title)}>View Staff</button> </li> ))} </ul> )} {level.responsibilities && ( <ul style={{margin: 0, paddingLeft: '20px'}}> {level.responsibilities.map(r => <li key={r}>{r}</li>)} </ul> )} </div> ))} {data.mainRole && ( <div> <h3 style={{marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary)'}}>Core Role: {data.mainRole}</h3> <strong>Responsibilities:</strong> <ul style={{margin: 0, paddingLeft: '20px'}}> {data.responsibilities.map(r => <li key={r}>{r}</li>)} </ul> </div> )} </div> );

// --- Dashboard Chart Component ---
const StaffChart = ({ staff }) => {
  const chartData = useMemo(() => {
    const depts = staff.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});
    const maxVal = Math.max(...Object.values(depts), 1); // Avoid division by zero
    return Object.entries(depts).map(([name, count]) => ({
      name,
      count,
      height: (count / maxVal) * 100,
    }));
  }, [staff]);

  return (
    <div className="chart-container">
      <div className="chart-title">Staff Distribution by Department</div>
      <div className="bar-chart">
        {chartData.map(d => (
          <div key={d.name} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="bar" style={{ height: `${d.height}%` }}>
              {d.count}
            </div>
            <div className="bar-label">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Administration Page Component ---
function AdministrationPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [hiringPipeline, setHiringPipeline] = useState(initialHiringPipeline);
  const [budgets, setBudgets] = useState(initialBudgets);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  // --- Handlers ---
  const showSuccessMessage = (message) => { setSuccessMessage(message); setTimeout(() => setSuccessMessage(''), 3000); };
  const handleOpenStaffModal = (staff = null) => { setEditingStaff(staff); setIsStaffModalOpen(true); };
  const handleCloseStaffModal = () => { setIsStaffModalOpen(false); setEditingStaff(null); };
  const handleStaffFormSubmit = (staffData) => { if (editingStaff) { setStaffMembers(prev => prev.map(s => s.id === staffData.id ? staffData : s)); showSuccessMessage(`✅ Successfully updated ${staffData.name}.`); } else { setStaffMembers(prev => [staffData, ...prev]); showSuccessMessage(`✅ Successfully added ${staffData.name}.`); } };
  const handleDeleteStaff = (staff) => { if (window.confirm(`Are you sure you want to terminate ${staff.name}?`)) { setStaffMembers(prev => prev.filter(s => s.id !== staff.id)); showSuccessMessage(`🗑️ Successfully removed ${staff.name}.`); } };
  const handleUpdateHiringStage = (jobId, newStage) => { setHiringPipeline(prev => prev.map(job => job.id === jobId ? { ...job, stage: newStage } : job )); showSuccessMessage(`Updated job ${jobId} to ${newStage}.`); };
  const handleSelectRole = (roleTitle) => { setSearchTerm(roleTitle); setActiveTab('directory'); };
  const handleProcessSalaries = () => { setIsProcessing(true); setSuccessMessage('Processing payroll...'); const activeStaff = staffMembers.filter(s => s.status === 'Active'); const totalPayroll = activeStaff.reduce((sum, s) => sum + (s.salary / 12), 0); setTimeout(() => { setIsProcessing(false); showSuccessMessage(`✅ Payroll processed for ${activeStaff.length} staff. Total: ₹${totalPayroll.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`); }, 2000); };
  
  // --- Memoized calculations ---
  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffMembers, searchTerm]);
  
  const kpi = useMemo(() => {
    const total = staffMembers.length;
    const active = staffMembers.filter(s => s.status === 'Active').length;
    const onLeave = staffMembers.filter(s => s.status === 'On Leave').length;
    const payroll = staffMembers.reduce((sum, s) => sum + s.salary, 0);
    return { total, active, onLeave, payroll };
  }, [staffMembers]);

  return (
    <> 
      {/* --- Modals --- */}
      {isStaffModalOpen && (
        <Modal onClose={handleCloseStaffModal}>
          <StaffForm 
            staff={editingStaff}
            onSubmit={handleStaffFormSubmit}
            onClose={handleCloseStaffModal}
          />
        </Modal>
      )}
            
      {/* --- Tab Navigation --- */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>
          👥 Staff Directory ({staffMembers.length})
        </button>
        <button className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
          🛠️ Role Management
        </button>
        <button className={`tab-btn ${activeTab === 'hiring' ? 'active' : ''}`} onClick={() => setActiveTab('hiring')}>
          🚀 Hiring ({hiringPipeline.length})
        </button>
        <button className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>
          💰 Payroll
        </button>
      </div>
      
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* --- Conditional Tab Content --- */}
      <div className="tab-content" style={{marginTop: '1.5rem'}}>

        {/* === DASHBOARD TAB === */}
        {activeTab === 'dashboard' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card kpi-info">
                <span className="kpi-title"><span>👥</span> Total Staff</span>
                <span className="kpi-value">{kpi.total}</span>
                <span className="kpi-delta">All departments</span>
              </div>
              <div className="kpi-card kpi-positive">
                <span className="kpi-title"><span>✔️</span> Active Staff</span>
                <span className="kpi-value">{kpi.active}</span>
                <span className="kpi-delta positive">{kpi.total > 0 ? ((kpi.active / kpi.total) * 100).toFixed(0) : 0}% of total</span>
              </div>
              <div className="kpi-card kpi-warning">
                <span className="kpi-title"><span>⏸️</span> On Leave</span>
                <span className="kpi-value">{kpi.onLeave}</span>
                <span className="kpi-delta negative">{kpi.total > 0 ? ((kpi.onLeave / kpi.total) * 100).toFixed(0) : 0}% of total</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-title"><span>💰</span> Annual Payroll</span>
                <span className="kpi-value">₹{kpi.payroll.toLocaleString('en-IN')}</span>
                <span className="kpi-delta">Avg. ₹{kpi.total > 0 ? (kpi.payroll / kpi.total).toLocaleString('en-IN', {maximumFractionDigits: 0}) : 0}</span>
              </div>
            </div>
            <div className="content-card">
              <StaffChart staff={staffMembers} />
            </div>
          </>
        )}

        {/* === Staff Directory TAB === */}
        {activeTab === 'directory' && (
          <div className="content-card full-width">
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search staff..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => handleOpenStaffModal(null)} className="btn btn-primary"><span>➕</span> Add New Staff</button>
            </div>
            <div className="table-container">
              <table>
                 <thead>
                  <tr>
                    <th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Contact</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length > 0 ? filteredStaff.map(staff => (
                    <tr key={staff.id}>
                      <td>
                        <div style={{fontWeight: 600}}>{staff.name}</div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{staff.id} | Joined: {staff.joinDate}</div>
                      </td>
                      <td>{staff.department}</td>
                      <td>{staff.role}</td>
                      <td><span className={`status ${staff.status.replace(/ /g, '-').toLowerCase()}`}>{staff.status}</span></td>
                      <td>
                        <div style={{fontWeight: 500}}>{staff.email}</div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{staff.phone}</div>
                      </td>
                      <td className="actions">
                        <button onClick={() => handleOpenStaffModal(staff)} className="btn-icon" title="Edit">✏️</button>
                        <button onClick={() => handleDeleteStaff(staff)} className="btn-icon-danger" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem'}}>No staff members found matching "{searchTerm}".</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === Role Management TAB === */}
        {activeTab === 'roles' && (
           <>
             <div className="content-card full-width" style={{marginBottom: '1.5rem'}}>
               <h2>University Organizational Structure</h2>
               <p>This reflects the defined roles and reporting structure from <code>src/data/rolesData.js</code>.</p>
             </div>
            <div className="content-grid-admin">
              <RoleCard data={rolesData.administration} onSelectRole={handleSelectRole} />
              <RoleCard data={rolesData.financial} onSelectRole={handleSelectRole} />
              <RoleCard data={rolesData.admission} onSelectRole={handleSelectRole} />
            </div>
          </>
        )}

        {/* === Hiring Pipeline TAB === */}
        {activeTab === 'hiring' && (
          <div className="content-grid-admin">
            <div className="content-card">
              <div className="toolbar" style={{ padding: 0, borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.75rem'}}>
                <h2 style={{borderBottom: 'none', paddingBottom: 0, marginBottom: 0}}>Active Hiring Pipeline</h2>
                 {/* <button className="btn btn-primary btn-sm"><span>➕</span> Add Position</button> */}
              </div>
              {/* FIXED: Removed duplicate style prop, used className */}
              <ul className="hiring-list"> 
                {hiringPipeline.map(job => (
                   <li key={job.id}> {/* FIXED: Removed duplicate style prop */}
                    <div>
                      <span className="job-role">{job.role}</span> {/* FIXED: Used className */}
                      <span className="job-stage">({job.candidates} candidates)</span> {/* FIXED: Used className */}
                    </div>
                    <select 
                      value={job.stage} 
                      onChange={(e) => handleUpdateHiringStage(job.id, e.target.value)}
                      style={{padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '0.9rem', backgroundColor: 'var(--input-bg)'}}
                    >
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer Released">Offer Released</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="content-card">
               <h2 style={{borderBottom: 'none', paddingBottom: 0, marginBottom: '1.5rem'}}>Departmental Budgets Overview</h2>
               {/* FIXED: Removed duplicate style prop, used className */}
              <ul className="budget-list"> 
                {budgets.map(b => (
                   <li key={b.id}>
                    <div className="budget-info"> {/* FIXED: Used className */}
                      <span className="budget-dept">{b.department}</span> {/* FIXED: Used className */}
                      <span className="budget-amount">₹{b.spent.toLocaleString()} / ₹{b.allocated.toLocaleString()}</span> {/* FIXED: Used className */}
                    </div>
                    <div className="progress-bar-container"> {/* FIXED: Used className */}
                      <div className="progress-bar" style={{width:`${(b.spent / b.allocated) * 100}%`}}></div> {/* FIXED: Used className */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* === Payroll TAB === */}
        {activeTab === 'payroll' && (
          <div className="content-card full-width">
             <div className="toolbar" style={{ padding: 0, borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.75rem'}}>
               <h2 style={{borderBottom: 'none', paddingBottom: 0, marginBottom: 0}}>Payroll Processing</h2>
             </div>
            <div className="payroll-section" style={{marginBottom: '2rem'}}> {/* FIXED: Used className */}
              <p style={{margin: 0, color: 'var(--text-secondary)', maxWidth: '60%'}}>Process automated salary for <strong>{staffMembers.filter(s => s.status === 'Active').length} active staff</strong>.</p>
              <button onClick={handleProcessSalaries} className="btn btn-primary" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : `Process Monthly Salaries (₹${(staffMembers.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.salary, 0) / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })})`}
              </button>
            </div>
            
            <h3>Staff Salary Details</h3>
            <div className="table-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
               <table>
                <thead>
                  <tr><th>Employee ID</th><th>Name</th><th>Role</th><th>Annual Salary (₹)</th><th>Monthly (₹)</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {staffMembers.map(staff => (
                    <tr key={staff.id}> {/* FIXED: Removed duplicate style prop */}
                      <td>{staff.id}</td>
                      <td>{staff.name}</td>
                      <td>{staff.role}</td>
                      <td>{staff.salary.toLocaleString('en-IN')}</td>
                      <td><strong>{(staff.salary / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></td>
                      <td><span className={`status ${staff.status.replace(/ /g, '-').toLowerCase()}`}>{staff.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdministrationPage;