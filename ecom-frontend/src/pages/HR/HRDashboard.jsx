import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AttendanceManager from './AttendanceManager/AttendanceManager';
import EmployeeManager from './EmployeeManager/EmployeeManager';
import './HR.css';

const HRDashboard = () => {
  const { user, isHR } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || (!isHR() && user.role !== 'hr' && user.role !== 'HR')) {
    return <Navigate to="/" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'employees': return <EmployeeManager />;
      case 'attendance': return <AttendanceManager />;
      default:
        return (
          <div className="admin-overview">
            <h2 className="am-header-title">Store Overview</h2>
            <div className="grid-3">
              <div className="stat-card card">
                <div className="icon" style={{background: 'rgba(108,99,255,0.2)'}}>💰</div>
                <div><h4>Total Revenue</h4><h3>₹4,52,000</h3></div>
              </div>
              <div className="stat-card card">
                <div className="icon" style={{background: 'rgba(34,197,94,0.2)'}}>📦</div>
                <div><h4>Total Orders</h4><h3>1,245</h3></div>
              </div>
              <div className="stat-card card">
                <div className="icon" style={{background: 'rgba(245,158,11,0.2)'}}>👥</div>
                <div><h4>Active Users</h4><h3>5,430</h3></div>
              </div>
            </div>
            
            <h2 className="am-header-title" style={{marginTop:'3rem'}}>Recent Activity</h2>
            <div className="card" style={{padding:'1.5rem'}}>
              <p className="text-muted">Dashboard metrics running smoothly. Navigation active.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-brand">HR Panel</div>
        <ul className="admin-nav">
          <li><button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button></li>
          <li><button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>👥 Employees</button></li>
          <li><button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>📅 Leaves & Attendance</button></li>
        </ul>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default HRDashboard;
