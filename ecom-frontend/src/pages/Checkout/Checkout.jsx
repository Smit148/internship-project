import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast/ToastProvider';
import { placeOrder } from '../../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep]     = useState(1); // 1=Address, 2=Payment, 3=Success
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  });
  const [payment, setPayment] = useState('COD');

  const shipping   = cartTotal > 1000 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  const handleAddressChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setLoading(true);
    const orderData = {
      address: `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      payment_method: payment,
      total_amount: grandTotal,
      items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
    };
    try {
      await placeOrder(orderData);
    } catch {
      // demo mode: proceed even without backend
    }
    clearCart();
    setStep(3);
    showToast('Order placed successfully! 🎉', 'success');
    setLoading(false);
  };

  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="section-title">Checkout</h1>

        {/* Steps Indicator */}
        <div className="checkout-steps">
          {['Delivery Address', 'Payment', 'Confirmation'].map((s, i) => (
            <div key={s} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="checkout-layout">
            <div className="checkout-form card">
              <h2 className="form-section-title">📍 Delivery Address</h2>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="co-name">Full Name</label>
                  <input id="co-name" name="fullName" className="form-control" placeholder="John Doe" value={address.fullName} onChange={handleAddressChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-phone">Phone Number</label>
                  <input id="co-phone" name="phone" className="form-control" placeholder="9876543210" value={address.phone} onChange={handleAddressChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="co-street">Street Address</label>
                <input id="co-street" name="street" className="form-control" placeholder="123, MG Road, Apt 4B" value={address.street} onChange={handleAddressChange} required />
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="co-city">City</label>
                  <input id="co-city" name="city" className="form-control" placeholder="Mumbai" value={address.city} onChange={handleAddressChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-state">State</label>
                  <input id="co-state" name="state" className="form-control" placeholder="Maharashtra" value={address.state} onChange={handleAddressChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-pin">Pincode</label>
                  <input id="co-pin" name="pincode" className="form-control" placeholder="400001" value={address.pincode} onChange={handleAddressChange} required />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setStep(2)} id="addr-next-btn"
                disabled={!address.fullName || !address.street || !address.city}>
                Continue to Payment →
              </button>
            </div>
            <OrderSummaryPanel items={cartItems} total={cartTotal} shipping={shipping} grand={grandTotal} />
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="checkout-layout">
            <div className="checkout-form card">
              <h2 className="form-section-title">💳 Payment Method</h2>
              <div className="payment-options">
                {[
                  { id: 'COD',    label: 'Cash on Delivery',  icon: '💵' },
                  { id: 'UPI',    label: 'UPI / GPay / PhonePe', icon: '📱' },
                  { id: 'CARD',   label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'WALLET', label: 'Digital Wallet',      icon: '👛' },
                ].map(opt => (
                  <label key={opt.id} className={`payment-option ${payment === opt.id ? 'selected' : ''}`} id={`pay-opt-${opt.id}`}>
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} />
                    <span className="pay-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="checkout-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)} id="pay-back-btn">← Back</button>
                <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading} id="place-order-btn">
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
            <OrderSummaryPanel items={cartItems} total={cartTotal} shipping={shipping} grand={grandTotal} />
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="order-success card">
            <div className="success-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with ShopVibe. Your order has been confirmed.</p>
            <p>Payment Method: <strong>{payment}</strong></p>
            <p>Amount Paid: <strong>₹{grandTotal.toLocaleString('en-IN')}</strong></p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/orders')} id="view-orders-btn">View My Orders</button>
              <button className="btn btn-ghost" onClick={() => navigate('/')} id="go-home-btn">Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderSummaryPanel = ({ items, total, shipping, grand }) => (
  <div className="checkout-summary card">
    <h3 className="summary-title">Order Summary</h3>
    <div className="co-items">
      {items.map(i => (
        <div key={i.product_id} className="co-item">
          <span>{i.product_name} × {i.quantity}</span>
          <span>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
    <div className="summary-divider" />
    <div className="co-item"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
    <div className="co-item"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
    <div className="summary-divider" />
    <div className="co-item total-row"><strong>Total</strong><strong>₹{grand.toLocaleString('en-IN')}</strong></div>
  </div>
);

export default Checkout;
