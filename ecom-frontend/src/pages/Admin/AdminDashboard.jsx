import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import CategoryManager from './CategoryManager/CategoryManager';
import ProductManager from './ProductManager/ProductManager';
import OrderManager from './OrderManager/OrderManager';
import UserManager from './UserManager/UserManager';
import CustomerManager from './CustomerManager/CustomerManager';
import PaymentManager from './PaymentManager/PaymentManager';
import CartManager from './CartManager/CartManager';
import WishlistManager from './WishlistManager/WishlistManager';
import ShippingManager from './ShippingManager/ShippingManager';
import './Admin.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || (!isAdmin() && user.role !== 'admin' && user.role !== 'ADMIN')) {
    return <Navigate to="/" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'categories': return <CategoryManager />;
      case 'products': return <ProductManager />;
      case 'orders': return <OrderManager />;
      case 'users': return <UserManager />;
      case 'customers': return <CustomerManager />;
      case 'payments': return <PaymentManager />;
      case 'carts': return <CartManager />;
      case 'wishlists': return <WishlistManager />;
      case 'shipping': return <ShippingManager />;
      default:
        return (
          <div className="admin-overview">
            <h2 className="am-header-title">Admin Dashboard</h2>
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
              <p className="text-muted">System metrics running smoothly. All services operational.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-brand">Admin Panel</div>
        <ul className="admin-nav">
          <li><button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button></li>
          <li><button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>🧑‍💼 Employees</button></li>
          <li><button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>👥 Customers</button></li>
          <li><button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>📂 Categories</button></li>
          <li><button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>🏷️ Products</button></li>
          <li><button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Orders</button></li>
          <li><button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>💳 Payments</button></li>
          <li><button className={activeTab === 'carts' ? 'active' : ''} onClick={() => setActiveTab('carts')}>🛒 Carts</button></li>
          <li><button className={activeTab === 'wishlists' ? 'active' : ''} onClick={() => setActiveTab('wishlists')}>❤️ Wishlists</button></li>
          <li><button className={activeTab === 'shipping' ? 'active' : ''} onClick={() => setActiveTab('shipping')}>🚚 Shipping</button></li>
        </ul>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
