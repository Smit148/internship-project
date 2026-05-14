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
      </div>
    </div>
  );
};

export default ProductDetail;
