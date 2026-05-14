import React, { useState, useEffect } from 'react';
import { getAllEmployees, createEmployee } from '../../../services/hrService';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const EmployeeManager = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', department: '' });

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data || []);
    } catch (e) {
      console.error(e);
      showToast('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(form);
      showToast('Employee account created successfully!', 'success');
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE', department: '' });
      fetchEmployees();
    } catch {
      showToast('Failed to create employee', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Employee Management</h2>
      
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Create New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Temporary Password</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Department</label>
              <input type="text" name="department" className="form-control" value={form.department} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>All Employees</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', textAlign: 'left' }}>
              <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
              <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
              <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Email</th>
              <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Role</th>
              <th style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No employees found.</td></tr>
            )}
            {employees.map(emp => (
              <tr key={emp.employee_id || emp.id}>
                <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>{emp.employee_id || emp.id}</td>
                <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>{emp.name}</td>
                <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>{emp.email}</td>
                <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <span className="badge badge-success">{emp.role}</span>
                </td>
                <td style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)' }}>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManager;
