import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_REVIEWS = [
  { review_id: 1, product_id: 101, product_name: 'Wireless Headphones', customer_id: 1, customer_name: 'John Doe', rating: 5, review_text: 'Excellent sound quality and very comfortable to wear for long periods!', created_at: '2026-05-10T10:00:00Z', updated_at: '2026-05-10T10:00:00Z', status: true },
  { review_id: 2, product_id: 102, product_name: 'Running Shoes', customer_id: 2, customer_name: 'Alice Smith', rating: 4, review_text: 'Great shoes but the sizing runs a bit small. Otherwise perfect.', created_at: '2026-05-11T14:30:00Z', updated_at: '2026-05-11T14:30:00Z', status: true },
  { review_id: 3, product_id: 103, product_name: 'Bluetooth Speaker', customer_id: 3, customer_name: 'Bob Builder', rating: 1, review_text: 'Terrible product, broke after 2 days. Do not buy!', created_at: '2026-05-12T09:15:00Z', updated_at: '2026-05-12T09:15:00Z', status: false },
  { review_id: 4, product_id: 101, product_name: 'Wireless Headphones', customer_id: 4, customer_name: 'Diana Prince', rating: 5, review_text: 'Absolutely love them. Best purchase this year.', created_at: '2026-05-14T16:20:00Z', updated_at: '2026-05-14T16:20:00Z', status: true },
];

export default function ReviewManager() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter(r => r.status === true).length;
  const rejectedCount = reviews.filter(r => r.status === false).length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : 0;

  /* ── Moderation Actions ─────────────────────────────────────────── */
  const toggleStatus = (id, currentStatus) => {
    setReviews(reviews.map(r => r.review_id === id ? { ...r, status: !currentStatus, updated_at: new Date().toISOString() } : r));
    showToast(`Review ${!currentStatus ? 'Approved' : 'Rejected'}`, !currentStatus ? 'success' : 'warning');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      setReviews(reviews.filter(r => r.review_id !== id));
      showToast('Review deleted permanently', 'error');
    }
  };

  /* ── Star rendering ─────────────────────────────────────────────── */
  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>⭐ Review & Rating Management</h2>
          <p>Moderate customer reviews, ensure quality, and manage ratings.</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{totalReviews}</span>
          <span className="pm-stat-lbl">Total Reviews</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>{approvedCount}</span>
          <span className="pm-stat-lbl">Approved</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--danger)' }}>{rejectedCount}</span>
          <span className="pm-stat-lbl">Rejected/Pending</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>{avgRating} ⭐</span>
          <span className="pm-stat-lbl">Global Avg Rating</span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        {reviews.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">⭐</div>
            <h3>No reviews found</h3>
            <p>Customer reviews will appear here.</p>
          </div>
        ) : (
          <table className="am-table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th style={{ width: '30%' }}>Review Text</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.review_id} className={!r.status ? 'inactive-row' : ''}>
                  <td className="text-muted">#{r.review_id}</td>
                  <td className="fw-600">{r.product_name}</td>
                  <td>{r.customer_name}</td>
                  <td style={{ color: 'var(--warning)', letterSpacing: '2px' }}>{renderStars(r.rating)}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>"{r.review_text}"</td>
                  <td>
                    <span className={`badge ${r.status ? 'badge-success' : 'badge-danger'}`}>
                      {r.status ? 'Approved' : 'Rejected'}
                    </span>
                  </td>
                  <td>
                    <div className="am-actions" style={{ flexDirection: 'column', gap: '0.3rem' }}>
                      <button 
                        className={`btn btn-sm ${r.status ? 'btn-ghost' : 'btn-primary'}`} 
                        onClick={() => toggleStatus(r.review_id, r.status)}
                      >
                        {r.status ? '🚫 Reject' : '✅ Approve'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.review_id)}>
                        🗑️ Delete
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
