import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isHR, isStaff } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">Nexo</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li><Link to="/"         className={isActive('/')}>Home</Link></li>
          <li><Link to="/products" className={isActive('/products')}>Products</Link></li>
          {user && <li><Link to="/orders"   className={isActive('/orders')}>Orders</Link></li>}
          {user && <li><Link to="/wishlist" className={isActive('/wishlist')}>Wishlist</Link></li>}
          {isStaff() && <li><Link to="/staff" className={`admin-link ${isActive('/staff')}`}>Staff Portal</Link></li>}
          {isHR() && <li><Link to="/hr" className={`admin-link ${isActive('/hr')}`}>HR Portal</Link></li>}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" id="nav-cart-btn">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">👤 {user.name?.split(' ')[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="nav-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login"    className="btn btn-ghost btn-sm" id="nav-login-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Register</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="nav-hamburger">
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'show' : ''}`}>
        <Link to="/"         onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/cart"     onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
        {user && <Link to="/orders"   onClick={() => setMenuOpen(false)}>Orders</Link>}
        {user && <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>}
        {isStaff() && <Link to="/staff" onClick={() => setMenuOpen(false)}>Staff Portal</Link>}
        {isHR() && <Link to="/hr" onClick={() => setMenuOpen(false)}>HR Panel</Link>}
        {user
          ? <button onClick={handleLogout}>Logout</button>
          : <>
              <Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
