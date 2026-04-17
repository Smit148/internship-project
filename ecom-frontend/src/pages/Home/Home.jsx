import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import './Home.css';

/* ---- Mock data fallback (until backend is ready) ---- */
const MOCK_PRODUCTS = [
  { product_id: 1, product_name: 'Wireless Headphones', description: 'Premium sound quality with noise cancellation.', price: 2999, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category_name: 'Electronics', status: true },
  { product_id: 2, product_name: 'Running Shoes', description: 'Lightweight and comfortable for everyday runs.', price: 1799, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category_name: 'Footwear', status: true },
  { product_id: 3, product_name: 'Leather Backpack', description: 'Durable leather backpack for travel or work.', price: 3499, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category_name: 'Bags', status: true },
  { product_id: 4, product_name: 'Smart Watch', description: 'Track your fitness and stay connected all day.', price: 5999, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category_name: 'Electronics', status: true },
  { product_id: 5, product_name: 'Sunglasses', description: 'UV-protected polarized lenses in a stylish frame.', price: 999, image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category_name: 'Accessories', status: true },
  { product_id: 6, product_name: 'Mechanical Keyboard', description: 'Tactile switches for the ultimate typing experience.', price: 4299, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', category_name: 'Electronics', status: true },
  { product_id: 7, product_name: 'Yoga Mat', description: 'Non-slip surface for safe and comfortable yoga.', price: 699, image_url: 'https://images.unsplash.com/photo-1601925228054-5caf8d3bb40a?w=400', category_name: 'Sports', status: true },
  { product_id: 8, product_name: 'Ceramic Coffee Mug', description: 'Handcrafted mug that keeps your drinks warm longer.', price: 349, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', category_name: 'Kitchen', status: true },
];

const MOCK_CATEGORIES = [
  { category_id: 1, category_name: 'Electronics', description: 'Gadgets & devices', status: true },
  { category_id: 2, category_name: 'Footwear',    description: 'Shoes & sandals',    status: true },
  { category_id: 3, category_name: 'Bags',        description: 'Backpacks & totes',  status: true },
  { category_id: 4, category_name: 'Accessories', description: 'Fashion accessories', status: true },
  { category_id: 5, category_name: 'Sports',      description: 'Fitness & outdoors',  status: true },
  { category_id: 6, category_name: 'Kitchen',     description: 'Home & kitchen',      status: true },
];

const CATEGORY_ICONS = { Electronics: '💻', Footwear: '👟', Bags: '👜', Accessories: '⌚', Sports: '🏃', Kitchen: '☕', General: '📦' };

const Home = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getAllProducts(), getAllCategories()]);
        setProducts(pRes.data.slice(0, 8));
        setCategories(cRes.data.filter(c => c.status).slice(0, 6));
      } catch {
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">✨ New Arrivals Every Week</span>
            <h1 className="hero-title">Shop the Future.<br /><span>Delivered Today.</span></h1>
            <p className="hero-sub">Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">Shop Now →</Link>
              <Link to="/register" className="btn btn-outline btn-lg" id="hero-join-btn">Join Free</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card-float">
              <span>🛍️</span>
              <p>10,000+ Products</p>
            </div>
            <div className="hero-card-float delay">
              <span>🚚</span>
              <p>Free Delivery</p>
            </div>
            <div className="hero-card-float delay2">
              <span>⭐</span>
              <p>Top Rated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {[
            { icon: '📦', label: 'Products',  val: '10K+' },
            { icon: '👥', label: 'Customers', val: '50K+' },
            { icon: '⭐', label: 'Reviews',   val: '4.9/5' },
            { icon: '🚚', label: 'Deliveries', val: '100K+' },
          ].map(s => (
            <div className="stat-item" key={s.label}>
              <span className="stat-icon">{s.icon}</span>
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-sub">Find exactly what you're looking for</p>
          {loading ? <Loader /> : (
            <div className="category-grid">
              {categories.map(cat => (
                <Link to={`/products?category=${cat.category_id}`} key={cat.category_id} className="category-card">
                  <span className="cat-icon">{CATEGORY_ICONS[cat.category_name] || '📦'}</span>
                  <h3>{cat.category_name}</h3>
                  <p>{cat.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-sub">Hand-picked just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm" id="view-all-btn">View All →</Link>
          </div>
          {loading ? <Loader /> : (
            <div className="grid-4">
              {products.map(p => <ProductCard key={p.product_id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to start shopping?</h2>
            <p>Join thousands of happy customers today.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
