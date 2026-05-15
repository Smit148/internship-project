import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_PAYMENTS = [
  { payment_id: 1, order_id: 1001, amount: 4798.00, payment_method: 'Credit Card', payment_status: 'Paid', created_at: '2026-04-10T10:30:00Z', updated_at: '2026-04-10T10:30:00Z' },
  { payment_id: 2, order_id: 1002, amount: 1799.00, payment_method: 'PayPal', payment_status: 'Paid', created_at: '2026-04-13T14:15:00Z', updated_at: '2026-04-13T14:15:00Z' },
  { payment_id: 3, order_id: 1003, amount: 3499.00, payment_method: 'Bank Transfer', payment_status: 'Failed', created_at: '2026-04-15T09:00:00Z', updated_at: '2026-04-15T09:05:00Z' },
  { payment_id: 4, order_id: 1004, amount: 2599.00, payment_method: 'Debit Card', payment_status: 'Refunded', created_at: '2026-04-18T16:45:00Z', updated_at: '2026-04-20T11:00:00Z' },
];

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'];

export default function PaymentManager() {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'refund' | 'details'
  const [currentPay, setCurrentPay] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPayments(MOCK_PAYMENTS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const totalRevenue = payments.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.payment_status === 'Refunded').reduce((s, p) => s + p.amount, 0);
  const failedCount = payments.filter(p => p.payment_status === 'Failed').length;

  /* ── Refund ─────────────────────────────────────────────────────── */
  const openRefund = (pay) => {
    setCurrentPay(pay);
    setModalMode('refund');
    setIsModalOpen(true);
  };

  const openDetails = (pay) => {
    setCurrentPay(pay);
    setModalMode('details');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPay(null);
  };

  const handleRefund = () => {
    setPayments(payments.map(p =>
      p.payment_id === currentPay.payment_id
        ? { ...p, payment_status: 'Refunded', updated_at: new Date().toISOString() }
        : p
    ));
    showToast(`Payment #${currentPay.payment_id} refunded successfully`, 'success');
    closeModal();
  };

  /* ── Status badge helper ────────────────────────────────────────── */
  const statusBadge = (status) => {
    const cls = status === 'Paid' ? 'badge-success'
      : status === 'Refunded' ? 'badge-warning'
      : 'badge-danger';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const methodIcon = (method) => {
    if (method === 'Credit Card' || method === 'Debit Card') return '💳';
    if (method === 'PayPal') return '🅿️';
    if (method === 'Bank Transfer') return '🏦';
    return '💰';
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <h2>💳 Payment Management</h2>
          <p>View transactions, track payment statuses, and process refunds.</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{payments.length}</span>
          <span className="pm-stat-lbl">Total Transactions</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="pm-stat-lbl">Revenue (Paid)</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>
            ₹{totalRefunded.toLocaleString('en-IN')}
          </span>
          <span className="pm-stat-lbl">Refunded</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--danger)' }}>
            {failedCount}
          </span>
          <span className="pm-stat-lbl">Failed</span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.payment_id}>
                <td className="fw-600">#{p.payment_id}</td>
                <td><span className="badge badge-primary">Order #{p.order_id}</span></td>
                <td className="fw-600">₹{p.amount.toLocaleString('en-IN')}</td>
                <td>{methodIcon(p.payment_method)} {p.payment_method}</td>
                <td>{statusBadge(p.payment_status)}</td>
                <td className="text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="am-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openDetails(p)}>
                      🔍 Details
                    </button>
                    {p.payment_status === 'Paid' && (
                      <button className="btn btn-danger btn-sm" onClick={() => openRefund(p)}>
                        ↩️ Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {isModalOpen && currentPay && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: modalMode === 'refund' ? '440px' : '500px' }}>

            {/* Refund confirmation */}
            {modalMode === 'refund' && (
              <>
                <h3 className="modal-title">↩️ Process Refund?</h3>
                <div className="modal-body" style={{ marginBottom: 0 }}>
                  <p>You are about to refund <strong>₹{currentPay.amount.toLocaleString('en-IN')}</strong> for <strong>Order #{currentPay.order_id}</strong>.</p>
                  <div className="deactivate-warning" style={{ marginTop: '1rem' }}>
                    <span className="dw-icon">⚠️</span>
                    <div>
                      <strong>Warning:</strong> This action will mark this payment as <strong>Refunded</strong>.
                      The refund amount will be returned to the customer via their original payment method
                      ({currentPay.payment_method}). This action is logged and cannot be undone.
                    </div>
                  </div>
                </div>
                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-danger" onClick={handleRefund}>Yes, Process Refund</button>
                </div>
              </>
            )}

            {/* Details view */}
            {modalMode === 'details' && (
              <>
                <h3 className="modal-title">🔍 Payment Details</h3>
                <div className="modal-body" style={{ marginBottom: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        ['Payment ID', `#${currentPay.payment_id}`],
                        ['Order ID', `#${currentPay.order_id}`],
                        ['Amount', `₹${currentPay.amount.toLocaleString('en-IN')}`],
                        ['Method', `${methodIcon(currentPay.payment_method)} ${currentPay.payment_method}`],
                        ['Status', currentPay.payment_status],
                        ['Processed At', new Date(currentPay.created_at).toLocaleString()],
                        ['Last Updated', new Date(currentPay.updated_at).toLocaleString()],
                      ].map(([label, val]) => (
                        <tr key={label}>
                          <td style={{ padding: '0.6rem 1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{label}</td>
                          <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button className="btn btn-ghost" onClick={closeModal}>Close</button>
                  {currentPay.payment_status === 'Paid' && (
                    <button className="btn btn-danger" onClick={() => { setModalMode('refund'); }}>↩️ Refund</button>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
