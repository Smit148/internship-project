import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Loader from '../../components/Loader/Loader';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    // Mock fetch
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch {
        // Fallback demo data
        setProduct({
          product_id: Number(id),
          product_name: "Premium Product " + id,
          description: "This is a detailed description for the product. It features premium materials, exceptional build quality, and a design that stands out. Perfect for everyday use or as a special gift.",
          price: 2999,
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          category_name: 'Electronics',
          status: true
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{padding:'4rem 0'}}><Loader /></div>;
  if (!product) return <div className="container empty-state"><h3>Product not found</h3></div>;

  const wishlisted = isWishlisted(product.product_id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="pd-layout card">
          <div className="pd-image-col">
            <img src={product.image_url} alt={product.product_name} className="pd-img" />
            <button className={`pd-wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
          
          <div className="pd-info-col">
            <span className="pd-category">{product.category_name}</span>
            <h1 className="pd-title">{product.product_name}</h1>
            <div className="pd-price-wrap">
              <span className="pd-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.status ? (
                <span className="badge badge-success">In Stock ({product.stock} left)</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>

            <div className="pd-divider" />
            
            <div className="pd-desc">
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            <div className="pd-divider" />

            {product.status && (
              <div className="pd-actions">
                <div className="pd-qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                </div>
                <button className="btn btn-primary pd-add-btn" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
              </div>
            )}
            
            <div className="pd-guarantees">
              <div className="guarantee-item">🚚 <span>Free Delivery</span></div>
              <div className="guarantee-item">🛡️ <span>1 Year Warranty</span></div>
              <div className="guarantee-item">↩️ <span>30-Day Returns</span></div>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ────────────────────────────────────────── */}
        <div className="pd-reviews-section card" style={{ marginTop: '2rem', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Customer Reviews & Ratings</h2>
          
          {/* Add Review Form */}
          <div className="pd-add-review" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Write a Review</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Review submitted for moderation!'); }}>
              <div className="form-group">
                <label className="form-label">Rating (1-5)</label>
                <select className="form-control" style={{ maxWidth: '150px' }} required>
                  <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value="4">⭐⭐⭐⭐☆ (4/5)</option>
                  <option value="3">⭐⭐⭐☆☆ (3/5)</option>
                  <option value="2">⭐⭐☆☆☆ (2/5)</option>
                  <option value="1">⭐☆☆☆☆ (1/5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-control" rows="3" placeholder="What did you like or dislike about this product?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
            </form>
          </div>

          {/* Review List */}
          <div className="pd-review-list">
            <div className="pd-review-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>John Doe</strong>
                <span style={{ color: 'var(--warning)', letterSpacing: '2px' }}>⭐⭐⭐⭐⭐</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>"Excellent sound quality and very comfortable to wear for long periods!"</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: 0, fontSize: '0.85rem' }}>Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ padding: 0, fontSize: '0.85rem', color: 'var(--danger)' }}>Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
