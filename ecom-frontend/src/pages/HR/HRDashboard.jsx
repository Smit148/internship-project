import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
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
      default:
        return (
          <div className="admin-overview">
            <h2 className="am-header-title">HR Overview</h2>
            <div className="grid-3">
              <div className="stat-card card">
                <div className="icon" style={{background: 'rgba(108,99,255,0.2)'}}>👥</div>
                <div><h4>Total Employees</h4><h3>45</h3></div>
              </div>
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
        </ul>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default HRDashboard;
