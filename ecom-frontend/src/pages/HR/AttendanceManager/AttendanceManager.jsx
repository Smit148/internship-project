import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';
import { getAllEmployees, getAllAttendance, getAllLeaves, updateLeaveStatus, recordAttendance } from '../../../services/hrService';

const AttendanceManager = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');
  const [today] = useState(new Date().toISOString().split('T')[0]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', department: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const empRes = await getAllEmployees();
      const attRes = await getAllAttendance();
      const leaRes = await getAllLeaves();
      
      setEmployees(empRes.data || []);
      setAttendanceLog(attRes.data || []);
      setLeaveRequests(leaRes.data || []);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch HR data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (empEmail, status) => {
    try {
      await recordAttendance(empEmail, status);
      showToast(`Marked ${status} for ${empEmail}`, 'info');
      fetchData(); // Refresh to catch changes
    } catch {
      showToast("Failed to mark attendance", "error");
    }
  };

  const handleLeaveStatusUpdate = async (leaveId, status) => {
    try {
      await updateLeaveStatus(leaveId, status);
      showToast(`Leave request ${status}`, 'success');
      fetchData();
    } catch {
      showToast("Failed to update leave status", "error");
    }
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    // Usually you'd call createEmployee
    const newEmp = {
      employee_id: Date.now(),
      ...form
    };
    setEmployees([...employees, newEmp]);
    showToast('Employee Added', 'success');
    setIsModalOpen(false);
    setForm({ name: '', email: '', role: '', department: '' });
  };

  const presentCount = attendanceLog.filter(log => log.date === today && log.status === 'PRESENT').length;

  // Helper to get today's status for a specific user
  const getTodayStatus = (email) => {
    const log = attendanceLog.find(l => l.userEmail === email && l.date === today);
    return log ? log.status : null;
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>👔 Employee & HR Management</h2>
          <p>Manage staff roster, attendance, and leave requests.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ New Employee</button>
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div className="icon" style={{fontSize: '2rem', background: 'rgba(34,197,94,0.1)', padding:'0.5rem', borderRadius:'8px'}}>📅</div>
           <div><h4 style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Today's Date</h4>
           <h3 style={{fontSize:'1.2rem'}}>{today}</h3></div>
        </div>
        <div className="stat-card card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div className="icon" style={{fontSize: '2rem', background: 'rgba(108,99,255,0.1)', padding:'0.5rem', borderRadius:'8px'}}>👥</div>
           <div><h4 style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Total Employees</h4>
           <h3 style={{fontSize:'1.2rem'}}>{employees.length}</h3></div>
        </div>
        <div className="stat-card card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div className="icon" style={{fontSize: '2rem', background: 'rgba(245,158,11,0.1)', padding:'0.5rem', borderRadius:'8px'}}>✔️</div>
           <div><h4 style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Marked Present</h4>
           <h3 style={{fontSize:'1.2rem'}}>{presentCount} / {employees.length}</h3></div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('attendance')}>
          Attendance Log
        </button>
        <button className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('leaves')}>
          Leave Requests ({leaveRequests.filter(l => l.status === 'Pending').length} Pending)
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div className="am-table-wrap card">
          <table className="am-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Role / Dept</th>
                <th>Today's Status</th>
                <th>Override Attendance</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const status = getTodayStatus(emp.email);
                return (
                <tr key={emp.employee_id}>
                  <td>#{emp.employee_id}</td>
                  <td className="fw-600">
                    {emp.name}
                    <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{emp.email}</div>
                  </td>
                  <td>
                     <span className="badge badge-primary">{emp.department}</span>
                     <div style={{fontSize:'0.8rem', marginTop:'0.2rem'}}>{emp.role}</div>
                  </td>
                  <td>
                    {status ? (
                      <span className={`badge ${
                        status === 'PRESENT' ? 'badge-success' : 
                        status === 'ABSENT' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {status}
                      </span>
                    ) : <span className="text-muted" style={{fontStyle:'italic'}}>Not Marked</span>}
                  </td>
                  <td>
                    <div className="am-actions">
                      <button className="btn btn-ghost btn-sm" style={{color:'var(--success)'}} onClick={() => handleMarkAttendance(emp.email, 'PRESENT')}>Present</button>
                      <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}} onClick={() => handleMarkAttendance(emp.email, 'ABSENT')}>Absent</button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="am-table-wrap card">
          <table className="am-table">
            <thead>
              <tr>
                <th>Employee Email</th>
                <th>Leave Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No leave requests found.</td></tr>
              )}
              {leaveRequests.map(leave => (
                <tr key={leave.id}>
                  <td className="fw-600">{leave.userEmail}</td>
                  <td>{leave.startDate} to {leave.endDate}</td>
                  <td><em className="text-muted">{leave.reason}</em></td>
                  <td>
                    <span className={`badge ${leave.status === 'Approved' ? 'badge-success' : leave.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'Pending' ? (
                      <div className="am-actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleLeaveStatusUpdate(leave.id, 'Approved')}>Approve</button>
                        <button className="btn btn-sm btn-ghost" style={{color:'var(--danger)'}} onClick={() => handleLeaveStatusUpdate(leave.id, 'Rejected')}>Reject</button>
                      </div>
                    ) : (
                      <span className="text-muted">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSaveEmployee}>
              <h3 className="modal-title">Add New Employee</h3>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="grid-2">
                    <div className="form-group">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" required value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                        <option value="">Select Dept</option>
                        <option value="IT">IT</option>
                        <option value="Operations">Operations</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Sales">Sales</option>
                    </select>
                    </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;
