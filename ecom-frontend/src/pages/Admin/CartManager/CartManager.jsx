import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_CARTS = [
  { cart_id: 1, customer_id: 1, customer_name: 'John Doe', product_id: 101, product_name: 'Wireless Headphones', quantity: 2, total_price: 5998.00, created_at: '2026-04-10T10:30:00Z', updated_at: '2026-04-10T10:30:00Z', status: 'active' },
  { cart_id: 2, customer_id: 1, customer_name: 'John Doe', product_id: 103, product_name: 'Bluetooth Speaker', quantity: 1, total_price: 3499.00, created_at: '2026-04-10T10:32:00Z', updated_at: '2026-04-10T10:32:00Z', status: 'active' },
  { cart_id: 3, customer_id: 2, customer_name: 'Alice Smith', product_id: 102, product_name: 'Running Shoes', quantity: 1, total_price: 1799.00, created_at: '2026-04-08T14:15:00Z', updated_at: '2026-04-08T14:15:00Z', status: 'abandoned' },
  { cart_id: 4, customer_id: 3, customer_name: 'Bob Builder', product_id: 101, product_name: 'Wireless Headphones', quantity: 3, total_price: 8997.00, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-03-25T09:05:00Z', status: 'abandoned' },
  { cart_id: 5, customer_id: 4, customer_name: 'Diana Prince', product_id: 104, product_name: 'Laptop Stand', quantity: 1, total_price: 1299.00, created_at: '2026-04-12T16:45:00Z', updated_at: '2026-04-13T11:00:00Z', status: 'converted' },
];

export default function CartManager() {
  const { showToast } = useToast();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'abandoned' | 'converted'

  useEffect(() => {
    setTimeout(() => {
      setCarts(MOCK_CARTS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const activeCarts = carts.filter(c => c.status === 'active');
  const abandonedCarts = carts.filter(c => c.status === 'abandoned');
  const convertedCarts = carts.filter(c => c.status === 'converted');
  const totalCartValue = carts.filter(c => c.status === 'active').reduce((s, c) => s + c.total_price, 0);
  const abandonmentRate = carts.length > 0
    ? Math.round((abandonedCarts.length / carts.length) * 100)
    : 0;

  /* ── Filtered list ──────────────────────────────────────────────── */
  const filtered = filter === 'all' ? carts : carts.filter(c => c.status === filter);

  /* ── Remove cart item (admin) ───────────────────────────────────── */
  const handleRemove = (cartId) => {
    setCarts(carts.filter(c => c.cart_id !== cartId));
    showToast('Cart item removed', 'warning');
  };

  /* ── Status badge ───────────────────────────────────────────────── */
  const statusBadge = (status) => {
    const cls = status === 'active' ? 'badge-success'
      : status === 'converted' ? 'badge-primary'
      : 'badge-warning';
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <h2>🛒 Cart Management</h2>
          <p>View customer carts, track items, and analyze cart abandonment.</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{carts.length}</span>
          <span className="pm-stat-lbl">Total Cart Items</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>{activeCarts.length}</span>
          <span className="pm-stat-lbl">Active Carts</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>{abandonedCarts.length}</span>
          <span className="pm-stat-lbl">Abandoned</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--primary)' }}>{convertedCarts.length}</span>
          <span className="pm-stat-lbl">Converted</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--danger)' }}>{abandonmentRate}%</span>
          <span className="pm-stat-lbl">Abandonment Rate</span>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'active', 'abandoned', 'converted'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${carts.length})` : `(${carts.filter(c => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* ── Active Cart Value ───────────────────────────────────────── */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>💰 Total Active Cart Value</span>
        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--success)' }}>₹{totalCartValue.toLocaleString('en-IN')}</span>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">🛒</div>
            <h3>No cart items found</h3>
            <p>No items match the selected filter.</p>
          </div>
        ) : (
          <table className="am-table">
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.cart_id} className={c.status === 'abandoned' ? 'inactive-row' : ''}>
                  <td className="text-muted">#{c.cart_id}</td>
                  <td className="fw-600">{c.customer_name}</td>
                  <td>{c.product_name}</td>
                  <td className="fw-600">{c.quantity}</td>
                  <td className="fw-600">₹{c.total_price.toLocaleString('en-IN')}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td className="text-muted">{new Date(c.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div className="am-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(c.cart_id)}>
                        🗑️ Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
