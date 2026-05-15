import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';

const COURIERS = ['BlueDart', 'Delhivery', 'FedEx', 'DTDC', 'India Post'];

const MOCK_SHIPMENTS = [
  { shipping_id: 1, order_id: 1001, courier_service: 'BlueDart', tracking_number: 'BD9876543210', shipping_status: 'Delivered', shipping_cost: 0, created_at: '2026-04-10T12:00:00Z', updated_at: '2026-04-14T09:00:00Z' },
  { shipping_id: 2, order_id: 1002, courier_service: 'Delhivery', tracking_number: 'DL1234567890', shipping_status: 'In Transit', shipping_cost: 99, created_at: '2026-04-13T15:00:00Z', updated_at: '2026-04-15T10:00:00Z' },
  { shipping_id: 3, order_id: 1003, courier_service: 'FedEx', tracking_number: 'FX5566778899', shipping_status: 'Shipped', shipping_cost: 149, created_at: '2026-04-15T11:00:00Z', updated_at: '2026-04-15T11:00:00Z' },
  { shipping_id: 4, order_id: 1004, courier_service: 'DTDC', tracking_number: '', shipping_status: 'Pending', shipping_cost: 79, created_at: '2026-04-18T17:00:00Z', updated_at: '2026-04-18T17:00:00Z' },
];

export default function ShippingManager() {
  const { showToast } = useToast();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShip, setCurrentShip] = useState(null);
  const [form, setForm] = useState({ courier_service: '', tracking_number: '', shipping_status: '' });

  useEffect(() => {
    setTimeout(() => {
      setShipments(MOCK_SHIPMENTS);
      setLoading(false);
    }, 600);
  }, []);

  /* ── Stats ──────────────────────────────────────────────────────── */
  const pending = shipments.filter(s => s.shipping_status === 'Pending').length;
  const shipped = shipments.filter(s => s.shipping_status === 'Shipped').length;
  const inTransit = shipments.filter(s => s.shipping_status === 'In Transit').length;
  const delivered = shipments.filter(s => s.shipping_status === 'Delivered').length;
  const totalCost = shipments.reduce((s, sh) => s + sh.shipping_cost, 0);

  /* ── Edit modal ─────────────────────────────────────────────────── */
  const openEdit = (ship) => {
    setCurrentShip(ship);
    setForm({
      courier_service: ship.courier_service,
      tracking_number: ship.tracking_number,
      shipping_status: ship.shipping_status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentShip(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShipments(shipments.map(s =>
      s.shipping_id === currentShip.shipping_id
        ? { ...s, ...form, updated_at: new Date().toISOString() }
        : s
    ));
    showToast(`Shipping #${currentShip.shipping_id} updated successfully`, 'success');
    closeModal();
  };

  /* ── Status badge ───────────────────────────────────────────────── */
  const statusBadge = (status) => {
    const cls = status === 'Delivered' ? 'badge-success'
      : status === 'In Transit' ? 'badge-primary'
      : status === 'Shipped' ? 'badge-info'
      : 'badge-warning';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <h2>🚚 Shipping Management</h2>
          <p>Track shipments, update courier details, and monitor delivery statuses.</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{shipments.length}</span>
          <span className="pm-stat-lbl">Total Shipments</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>{pending}</span>
          <span className="pm-stat-lbl">Pending</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--info, #3b82f6)' }}>{shipped}</span>
          <span className="pm-stat-lbl">Shipped</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--primary)' }}>{inTransit}</span>
          <span className="pm-stat-lbl">In Transit</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>{delivered}</span>
          <span className="pm-stat-lbl">Delivered</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num">₹{totalCost.toLocaleString('en-IN')}</span>
          <span className="pm-stat-lbl">Total Shipping Cost</span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>Shipping ID</th>
              <th>Order ID</th>
              <th>Courier</th>
              <th>Tracking #</th>
              <th>Status</th>
              <th>Cost</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.shipping_id}>
                <td className="fw-600">#{s.shipping_id}</td>
                <td><span className="badge badge-primary">Order #{s.order_id}</span></td>
                <td>{s.courier_service}</td>
                <td>
                  {s.tracking_number
                    ? <code className="pm-sku">{s.tracking_number}</code>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>{statusBadge(s.shipping_status)}</td>
                <td className="fw-600">{s.shipping_cost === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${s.shipping_cost}`}</td>
                <td className="text-muted">{new Date(s.updated_at).toLocaleDateString()}</td>
                <td>
                  <div className="am-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>✏️ Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────── */}
      {isModalOpen && currentShip && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSave}>
              <h3 className="modal-title">✏️ Update Shipping — Order #{currentShip.order_id}</h3>
              <div className="modal-body" style={{ marginBottom: 0 }}>
                <div className="form-group">
                  <label className="form-label">Courier Service</label>
                  <select className="form-control" required value={form.courier_service} onChange={e => setForm({ ...form, courier_service: e.target.value })}>
                    <option value="">Select Courier</option>
                    {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tracking Number</label>
                  <input type="text" className="form-control" placeholder="e.g. BD9876543210" value={form.tracking_number} onChange={e => setForm({ ...form, tracking_number: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Shipping Status</label>
                  <select className="form-control" required value={form.shipping_status} onChange={e => setForm({ ...form, shipping_status: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
