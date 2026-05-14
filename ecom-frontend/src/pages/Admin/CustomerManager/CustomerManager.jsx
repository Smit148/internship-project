import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_CUSTOMERS = [
  { user_id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '9876543210', status: true, order_count: 5 },
  { user_id: 2, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', phone: '9123456789', status: true, order_count: 2 },
  { user_id: 3, first_name: 'Bob', last_name: 'Builder', email: 'bob@example.com', phone: '9988776655', status: false, order_count: 0 },
];

export default function CustomerManager() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'deactivate'
  const [currentCust, setCurrentCust] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', status: true });

  useEffect(() => {
    // Simulate fetching customers from API
    setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setLoading(false);
    }, 600);
  }, []);

  const openAdd = () => {
    setForm({ first_name: '', last_name: '', email: '', phone: '', status: true });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEdit = (cust) => {
    setCurrentCust(cust);
    setForm({ 
        first_name: cust.first_name, 
        last_name: cust.last_name, 
        email: cust.email, 
        phone: cust.phone, 
        status: cust.status 
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openDeactivate = (cust) => {
    setCurrentCust(cust);
    setModalMode('deactivate');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCust(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const newC = { user_id: Date.now(), ...form, order_count: 0 };
        setCustomers([newC, ...customers]);
        showToast('Customer added successfully', 'success');
      } else {
        setCustomers(customers.map(c => c.user_id === currentCust.user_id ? { ...c, ...form } : c));
        showToast('Customer updated successfully', 'success');
      }
      closeModal();
    } catch {
      showToast('Error saving customer', 'error');
    }
  };

  const handleDeactivate = async () => {
    try {
      setCustomers(customers.map(c => c.user_id === currentCust.user_id ? { ...c, status: false } : c));
      showToast('Customer deactivated', 'warning');
      closeModal();
    } catch {
      showToast('Error deactivating customer', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>👥 Customer Management</h2>
          <p>Add, edit, and deactivate customer accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
      </div>

      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.user_id} className={!c.status ? 'inactive-row' : ''}>
                <td className="text-muted">#{c.user_id}</td>
                <td className="fw-600">{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td><span className="badge badge-info">{c.order_count} Orders</span></td>
                <td>
                  <span className={`badge ${c.status ? 'badge-success' : 'badge-danger'}`}>
                    {c.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="am-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                    {c.status && (
                        <button className="btn btn-danger btn-sm" onClick={() => openDeactivate(c)}>🚫 Deactivate</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: modalMode === 'deactivate' ? '400px' : '500px' }}>
            {modalMode === 'deactivate' ? (
                <>
                    <h3 className="modal-title">⚠️ Deactivate Customer?</h3>
                    <div className="modal-body">
                        <p>Are you sure you want to deactivate the account for <strong>{currentCust?.first_name} {currentCust?.last_name}</strong>?</p>
                        <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>
                            This is a soft-delete. Their data will be preserved but marked as inactive.
                        </p>
                    </div>
                    <div className="modal-actions" style={{marginTop: '1.5rem'}}>
                        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDeactivate}>Yes, Deactivate</button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSave}>
                <h3 className="modal-title">{modalMode === 'add' ? '+ Add New Customer' : '✏️ Edit Customer'}</h3>
                <div className="modal-body">
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-control" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-control" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    {modalMode === 'edit' && (
                    <div className="form-group" style={{flexDirection:'row', alignItems:'center', gap:'0.5rem', marginTop:'1rem'}}>
                        <input type="checkbox" id="cust-status" checked={form.status} onChange={e => setForm({...form, status: e.target.checked})} />
                        <label htmlFor="cust-status" className="form-label">Active Account</label>
                    </div>
                    )}
                </div>
                <div className="modal-actions" style={{marginTop: '1.5rem'}}>
                    <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Create Customer' : 'Save Changes'}</button>
                </div>
                </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
