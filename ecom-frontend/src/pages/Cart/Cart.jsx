import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast/ToastProvider';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, updateQty, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRemove = (id, name) => {
    removeFromCart(id);
    showToast(`${name} removed from cart`, 'warning');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }} id="cart-shop-btn">
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 1000 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>Shopping Cart 🛒</h1>

        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.product_id} className="cart-item card">
                <img
                  src={item.image_url || 'https://via.placeholder.com/90x90'}
                  alt={item.product_name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="cart-item-name">{item.product_name}</h3>
                  </Link>
                  <span className="cart-item-cat">{item.category_name}</span>
                  <span className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.product_id, item.quantity - 1)}
                      id={`qty-minus-${item.product_id}`}
                    >−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      id={`qty-plus-${item.product_id}`}
                    >+</button>
                  </div>
                  <span className="cart-item-subtotal">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm remove-btn"
                    onClick={() => handleRemove(item.product_id, item.product_name)}
                    id={`remove-cart-${item.product_id}`}
                  >🗑️</button>
                </div>
              </div>
            ))}

            <button className="btn btn-ghost btn-sm clear-btn" onClick={clearCart} id="clear-cart-btn">
              🗑️ Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-ship' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="ship-msg">Add ₹{(1000 - cartTotal).toLocaleString('en-IN')} more for free shipping</p>
              )}
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <strong>Total</strong>
                <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={() => navigate('/checkout')}
              id="proceed-checkout-btn"
            >
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: '0.75rem' }} id="continue-shopping-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
