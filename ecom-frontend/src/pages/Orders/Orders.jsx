import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/orderService';
import Loader from '../../components/Loader/Loader';
import './Orders.css';

const STATUS_COLORS = {
  PENDING:   'warning',
  CONFIRMED: 'info',
  SHIPPED:   'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const MOCK_ORDERS = [
  { order_id: 1001, order_date: '2026-04-10', status: 'DELIVERED', total_amount: 4798, address: 'John Doe, 123 MG Road, Mumbai - 400001', items: [{ product_name: 'Wireless Headphones', quantity: 1, price: 2999 }, { product_name: 'Sunglasses', quantity: 1, price: 999 }] },
  { order_id: 1002, order_date: '2026-04-13', status: 'SHIPPED',   total_amount: 1799, address: 'John Doe, 123 MG Road, Mumbai - 400001', items: [{ product_name: 'Running Shoes', quantity: 1, price: 1799 }] },
  { order_id: 1003, order_date: '2026-04-15', status: 'PENDING',   total_amount: 3499, address: 'John Doe, 123 MG Road, Mumbai - 400001', items: [{ product_name: 'Leather Backpack', quantity: 1, price: 3499 }] },
];

const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="section-title">My Orders</h1>
        <p className="section-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.order_id} className="order-card card">
                <div className="order-header" onClick={() => setExpanded(expanded === order.order_id ? null : order.order_id)}>
                  <div className="order-meta">
                    <span className="order-id">Order #{order.order_id}</span>
                    <span className="order-date">📅 {new Date(order.order_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="order-right">
                    <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`}>{order.status}</span>
                    <strong className="order-total">₹{order.total_amount?.toLocaleString('en-IN')}</strong>
                    <span className="expand-icon">{expanded === order.order_id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order.order_id && (
                  <div className="order-details">
                    <div className="order-address">
                      📍 <strong>Delivery:</strong> {order.address}
                    </div>
                    <table className="order-items-table">
                      <thead>
                        <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, i) => (
                          <tr key={i}>
                            <td>{item.product_name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price?.toLocaleString('en-IN')}</td>
                            <td>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
