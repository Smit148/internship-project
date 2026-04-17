import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast/ToastProvider';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.product_id);
    showToast(`${product.product_name} moved to cart!`, 'success');
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="section-title">My Wishlist ❤️</h1>
        <p className="section-sub">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🤍</div>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love by clicking the heart icon.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }} id="wishlist-browse-btn">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(product => (
              <div key={product.product_id} className="wishlist-card card">
                <Link to={`/products/${product.product_id}`}>
                  <img
                    src={product.image_url || 'https://via.placeholder.com/260x180'}
                    alt={product.product_name}
                    className="wishlist-img"
                  />
                </Link>
                <div className="wishlist-info">
                  <span className="wishlist-cat">{product.category_name}</span>
                  <Link to={`/products/${product.product_id}`}>
                    <h3 className="wishlist-name">{product.product_name}</h3>
                  </Link>
                  <p className="wishlist-price">₹{product.price?.toLocaleString('en-IN')}</p>
                  <div className="wishlist-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleMoveToCart(product)}
                      id={`move-cart-${product.product_id}`}
                    >
                      🛒 Move to Cart
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { removeFromWishlist(product.product_id); showToast('Removed from wishlist', 'warning'); }}
                      id={`remove-wish-${product.product_id}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
