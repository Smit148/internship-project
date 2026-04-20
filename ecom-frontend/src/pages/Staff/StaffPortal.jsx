import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/ToastProvider';
import { recordAttendance, getMyAttendance, applyForLeave, getMyLeaves } from '../../services/hrService';
import Loader from '../../components/Loader/Loader';

const StaffPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const attRes = await getMyAttendance(user.email);
      const leaveRes = await getMyLeaves(user.email);
      setAttendanceLogs(attRes.data);
      setLeaves(leaveRes.data);
      
      const todayDate = new Date().toISOString().split('T')[0];
      const todayLog = attRes.data.find(log => log.date === todayDate);
      if (todayLog) setTodayStatus(todayLog.status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = async () => {
    try {
      await recordAttendance(user.email, 'PRESENT');
      showToast('Marked Present for today!', 'success');
      fetchData();
    } catch (e) {
      showToast('Failed to mark attendance', 'error');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await applyForLeave(user.email, leaveForm);
      showToast('Leave applied successfully', 'success');
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (e) {
      showToast('Failed to apply for leave', 'error');
    }
  };

  if (!user || user.role !== 'EMPLOYEE') {
    return <Navigate to="/" />;
  }

  if (loading) return <div style={{padding:'4rem'}}><Loader /></div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Sidebar */}
        <div style={{ flex: '0 0 250px' }}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Staff Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, {user.name}</p>
          </div>
          <ul style={{ listStyle: 'none', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <li>
              <button 
                onClick={() => setActiveTab('attendance')}
                style={{ width: '100%', padding: '0.8rem 1rem', background: activeTab === 'attendance' ? 'var(--primary)' : 'transparent', color: activeTab === 'attendance' ? '#fff' : 'inherit', border: 'none', borderRadius: 'var(--radius)', textAlign: 'left', cursor: 'pointer', marginBottom: '0.2rem' }}
              >📝 Attendance</button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('leaves')}
                style={{ width: '100%', padding: '0.8rem 1rem', background: activeTab === 'leaves' ? 'var(--primary)' : 'transparent', color: activeTab === 'leaves' ? '#fff' : 'inherit', border: 'none', borderRadius: 'var(--radius)', textAlign: 'left', cursor: 'pointer' }}
              >📅 Leave Portal</button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'attendance' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>My Attendance</h2>
              
              <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Today's Status</h4>
                  {todayStatus ? (
                    <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>{todayStatus}</span>
                  ) : (
                    <span className="text-muted">Not Marked Yet</span>
                  )}
                </div>
                {!todayStatus && (
                  <button className="btn btn-primary" onClick={handleMarkPresent}>Mark Present</button>
                )}
              </div>

              <h3>Attendance History</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)', textAlign: 'left' }}>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.length === 0 && (
                    <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found.</td></tr>
                  )}
                  {attendanceLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>{log.date}</td>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>
                        <span className={`badge ${log.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Leave Application</h2>
              
              <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <form onSubmit={handleApplyLeave}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="form-label">Start Date</label>
                      <input type="date" required className="form-control" value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">End Date</label>
                      <input type="date" required className="form-control" value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Reason for Leave</label>
                    <textarea required className="form-control" rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} placeholder="e.g., Medical reasons, family event..." />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Leave Request</button>
                </form>
              </div>

              <h3>My Leave Requests</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)', textAlign: 'left' }}>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Dates / Reason</th>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Applied On</th>
                    <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 && (
                    <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leaves applied yet.</td></tr>
                  )}
                  {leaves.map(leave => (
                    <tr key={leave.id}>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: '500' }}>{leave.startDate} to {leave.endDate}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{leave.reason}</div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                        {new Date(leave.appliedOn).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>
                        <span className={`badge ${leave.status === 'Approved' ? 'badge-success' : leave.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StaffPortal;
