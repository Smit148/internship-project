import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product.product_id);

  return (
    <article className="product-card card">
      <div className="product-img-wrap">
        <Link to={`/products/${product.product_id}`}>
          <img
            src={product.image_url || 'https://via.placeholder.com/300x220?text=No+Image'}
            alt={product.product_name}
            className="product-img"
          />
        </Link>
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
          id={`wishlist-btn-${product.product_id}`}
          aria-label="Toggle Wishlist"
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
        {!product.status && (
          <span className="out-of-stock-tag">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category_name || 'General'}</span>
        <Link to={`/products/${product.product_id}`}>
          <h3 className="product-name">{product.product_name}</h3>
        </Link>
        <p className="product-desc">{product.description?.slice(0, 70)}...</p>

        <div className="product-footer">
          <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product)}
            disabled={!product.status}
            id={`add-cart-btn-${product.product_id}`}
          >
            {product.status ? '+ Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
