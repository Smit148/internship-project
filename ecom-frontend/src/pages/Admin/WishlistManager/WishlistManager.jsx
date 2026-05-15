import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const MOCK_WISHLISTS = [
  { wishlist_id: 1, customer_id: 1, customer_name: 'John Doe', product_id: 101, product_name: 'Wireless Headphones', price: 2999, status: true, created_at: '2026-04-10T10:30:00Z', updated_at: '2026-04-10T10:30:00Z' },
  { wishlist_id: 2, customer_id: 1, customer_name: 'John Doe', product_id: 103, product_name: 'Bluetooth Speaker', price: 3499, status: true, created_at: '2026-04-10T10:35:00Z', updated_at: '2026-04-10T10:35:00Z' },
  { wishlist_id: 3, customer_id: 2, customer_name: 'Alice Smith', product_id: 102, product_name: 'Running Shoes', price: 1799, status: true, created_at: '2026-04-08T14:15:00Z', updated_at: '2026-04-08T14:15:00Z' },
  { wishlist_id: 4, customer_id: 2, customer_name: 'Alice Smith', product_id: 104, product_name: 'Laptop Stand', price: 1299, status: false, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-06T11:00:00Z' },
  { wishlist_id: 5, customer_id: 3, customer_name: 'Bob Builder', product_id: 101, product_name: 'Wireless Headphones', price: 2999, status: true, created_at: '2026-04-12T16:45:00Z', updated_at: '2026-04-12T16:45:00Z' },
];

export default function WishlistManager() {
  const { showToast } = useToast();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWishlists(MOCK_WISHLISTS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const uniqueCustomers = [...new Set(wishlists.map(w => w.customer_id))].length;
  const uniqueProducts = [...new Set(wishlists.map(w => w.product_id))].length;
  const mostWishlisted = wishlists.reduce((acc, w) => {
    acc[w.product_name] = (acc[w.product_name] || 0) + 1;
    return acc;
  }, {});
  const topProduct = Object.entries(mostWishlisted).sort((a, b) => b[1] - a[1])[0];

  /* ── Remove ─────────────────────────────────────────────────────── */
  const handleRemove = (id) => {
    setWishlists(wishlists.filter(w => w.wishlist_id !== id));
    showToast('Wishlist entry removed', 'warning');
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <h2>❤️ Wishlist Management</h2>
          <p>Monitor customer wishlists and track popular products.</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{wishlists.length}</span>
          <span className="pm-stat-lbl">Total Entries</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--primary)' }}>{uniqueCustomers}</span>
          <span className="pm-stat-lbl">Customers</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>{uniqueProducts}</span>
          <span className="pm-stat-lbl">Unique Products</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>{topProduct ? topProduct[1] : 0}</span>
          <span className="pm-stat-lbl">Most Wishlisted</span>
        </div>
      </div>

      {/* ── Top Product Banner ──────────────────────────────────────── */}
      {topProduct && (
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>🔥 Most Wishlisted Product</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{topProduct[0]} ({topProduct[1]} saves)</span>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        {wishlists.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">❤️</div>
            <h3>No wishlist entries found</h3>
            <p>Customer wishlists will appear here.</p>
          </div>
        ) : (
          <table className="am-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Added On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlists.map(w => (
                <tr key={w.wishlist_id}>
                  <td className="text-muted">#{w.wishlist_id}</td>
                  <td className="fw-600">{w.customer_name}</td>
                  <td>{w.product_name}</td>
                  <td className="fw-600">₹{w.price.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${w.status ? 'badge-success' : 'badge-danger'}`}>
                      {w.status ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="text-muted">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="am-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(w.wishlist_id)}>
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
