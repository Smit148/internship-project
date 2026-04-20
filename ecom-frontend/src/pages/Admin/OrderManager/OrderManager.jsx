import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';
import { getAllOrders, updateOrderStatus } from '../../../services/orderService';

const MOCK_ORDERS = [
  { order_id: 1001, order_date: '2026-04-10', status: 'PENDING', total_amount: 4798, user: 'John Doe', address: '123 MG Road, Mumbai', items: 2 },
  { order_id: 1002, order_date: '2026-04-13', status: 'SHIPPED',   total_amount: 1799, user: 'Alice Smith', address: '45 Park St, Delhi', items: 1 },
  { order_id: 1003, order_date: '2026-04-15', status: 'DELIVERED', total_amount: 3499, user: 'Bob Builder', address: '99 Tech Park, Bangalore', items: 3 },
];

const OrderManager = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data.length ? res.data : MOCK_ORDERS);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
    } catch {
      showToast('Error updating order status', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>📦 Order Management</h2>
          <p>Review customer orders and update shipping statuses.</p>
        </div>
      </div>

      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td className="fw-600">#{o.order_id}</td>
                <td className="text-muted">{new Date(o.order_date).toLocaleDateString()}</td>
                <td>{o.user}</td>
                <td className="text-muted" style={{maxWidth: '200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {o.address}
                </td>
                <td className="fw-600">₹{o.total_amount?.toLocaleString('en-IN')}</td>
                <td>
                    <span className={`badge ${
                        o.status === 'DELIVERED' ? 'badge-success' : 
                        o.status === 'SHIPPED' ? 'badge-primary' : 
                        o.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                        {o.status}
                    </span>
                </td>
                <td>
                  <select 
                    className="form-control" 
                    style={{padding: '0.4rem', fontSize: '0.85rem'}}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                  >
                        <option value="PENDING">PENDING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
