import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_COUPONS = [
  { coupon_id: 1, coupon_code: 'WELCOME10', discount_type: 'Percentage', discount_value: 10, valid_from: '2026-01-01T00:00:00Z', valid_to: '2026-12-31T23:59:59Z', usage_limit: 1000, status: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { coupon_id: 2, coupon_code: 'FLAT500', discount_type: 'Fixed', discount_value: 500, valid_from: '2026-05-01T00:00:00Z', valid_to: '2026-05-31T23:59:59Z', usage_limit: 500, status: true, created_at: '2026-05-01T00:00:00Z', updated_at: '2026-05-01T00:00:00Z' },
  { coupon_id: 3, coupon_code: 'SUMMER20', discount_type: 'Percentage', discount_value: 20, valid_from: '2025-06-01T00:00:00Z', valid_to: '2025-08-31T23:59:59Z', usage_limit: 200, status: false, created_at: '2025-05-15T00:00:00Z', updated_at: '2025-09-01T00:00:00Z' },
];

export default function CouponManager() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ coupon_code: '', discount_type: 'Percentage', discount_value: '', valid_from: '', valid_to: '', usage_limit: '' });

  useEffect(() => {
    setTimeout(() => {
      setCoupons(MOCK_COUPONS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status).length;
  const expiredCoupons = coupons.filter(c => new Date(c.valid_to) < new Date()).length;

  /* ── Handlers ───────────────────────────────────────────────────── */
  const toggleStatus = (id, currentStatus) => {
    setCoupons(coupons.map(c => c.coupon_id === id ? { ...c, status: !currentStatus, updated_at: new Date().toISOString() } : c));
    showToast(`Coupon ${!currentStatus ? 'Activated' : 'Deactivated'}`, !currentStatus ? 'success' : 'warning');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this coupon?")) {
      setCoupons(coupons.filter(c => c.coupon_id !== id));
      showToast('Coupon deleted permanently', 'error');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newCoupon = {
      coupon_id: coupons.length + 1,
      ...form,
      status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCoupons([...coupons, newCoupon]);
    showToast('Coupon created successfully', 'success');
    setIsModalOpen(false);
    setForm({ coupon_code: '', discount_type: 'Percentage', discount_value: '', valid_from: '', valid_to: '', usage_limit: '' });
  };

  const isExpired = (dateString) => new Date(dateString) < new Date();

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>🎟️ Coupon & Discount Management</h2>
          <p>Create promotional codes and manage special offers for customers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Create Coupon</button>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{totalCoupons}</span>
          <span className="pm-stat-lbl">Total Coupons</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>{activeCoupons}</span>
          <span className="pm-stat-lbl">Active</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--danger)' }}>{expiredCoupons}</span>
          <span className="pm-stat-lbl">Expired</span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Usage Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => {
              const expired = isExpired(c.valid_to);
              return (
                <tr key={c.coupon_id} className={!c.status || expired ? 'inactive-row' : ''}>
                  <td className="fw-600"><code style={{ padding: '4px 8px', background: 'var(--bg-color)', borderRadius: '4px' }}>{c.coupon_code}</code></td>
                  <td className="fw-600" style={{ color: 'var(--primary)' }}>
                    {c.discount_type === 'Percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                  </td>
                  <td className="text-muted">{new Date(c.valid_from).toLocaleDateString()}</td>
                  <td className={expired ? 'text-danger fw-600' : 'text-muted'}>{new Date(c.valid_to).toLocaleDateString()}</td>
                  <td>{c.usage_limit}</td>
                  <td>
                    {expired ? (
                      <span className="badge badge-danger">Expired</span>
                    ) : (
                      <span className={`badge ${c.status ? 'badge-success' : 'badge-warning'}`}>
                        {c.status ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="am-actions">
                      <button className={`btn btn-sm ${c.status ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleStatus(c.coupon_id, c.status)}>
                        {c.status ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.coupon_id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Create Modal ────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSave}>
              <h3 className="modal-title">🎟️ Create New Coupon</h3>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Coupon Code</label>
                  <input type="text" className="form-control" placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} required value={form.coupon_code} onChange={e => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select className="form-control" required value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}>
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input type="number" className="form-control" placeholder="e.g. 10" required value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Valid From</label>
                    <input type="date" className="form-control" required value={form.valid_from} onChange={e => setForm({ ...form, valid_from: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valid To</label>
                    <input type="date" className="form-control" required value={form.valid_to} onChange={e => setForm({ ...form, valid_to: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Usage Limit</label>
                  <input type="number" className="form-control" placeholder="Total times this can be used" required value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
