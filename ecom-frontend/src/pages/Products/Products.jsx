import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import './Products.css';

const MOCK_PRODUCTS = [
  { product_id: 1, product_name: 'Wireless Headphones', description: 'Premium sound quality with noise cancellation for immersive listening.', price: 2999, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category_name: 'Electronics', category_id: 1, status: true },
  { product_id: 2, product_name: 'Running Shoes', description: 'Lightweight and comfortable for everyday runs and training.', price: 1799, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category_name: 'Footwear', category_id: 2, status: true },
  { product_id: 3, product_name: 'Leather Backpack', description: 'Durable leather backpack for travel or work. Fits 15" laptop.', price: 3499, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category_name: 'Bags', category_id: 3, status: true },
  { product_id: 4, product_name: 'Smart Watch', description: 'Track your fitness and stay connected all day long.', price: 5999, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category_name: 'Electronics', category_id: 1, status: true },
  { product_id: 5, product_name: 'Sunglasses', description: 'UV-protected polarized lenses in a stylish, slim frame.', price: 999, image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category_name: 'Accessories', category_id: 4, status: true },
  { product_id: 6, product_name: 'Mechanical Keyboard', description: 'Tactile switches for the ultimate typing experience. RGB backlit.', price: 4299, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', category_name: 'Electronics', category_id: 1, status: true },
  { product_id: 7, product_name: 'Yoga Mat', description: 'Non-slip surface for safe and comfortable yoga and pilates.', price: 699, image_url: 'https://images.unsplash.com/photo-1601925228054-5caf8d3bb40a?w=400', category_name: 'Sports', category_id: 5, status: true },
  { product_id: 8, product_name: 'Ceramic Coffee Mug', description: 'Handcrafted mug that keeps your drinks warm for hours.', price: 349, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', category_name: 'Kitchen', category_id: 6, status: true },
  { product_id: 9, product_name: 'Bluetooth Speaker', description: 'Waterproof portable speaker with 20hr battery life.', price: 1999, image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', category_name: 'Electronics', category_id: 1, status: true },
  { product_id: 10, product_name: 'Denim Jacket', description: 'Classic slim-fit denim jacket for all seasons.', price: 2499, image_url: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400', category_name: 'Accessories', category_id: 4, status: true },
  { product_id: 11, product_name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for better ergonomics.', price: 1299, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', category_name: 'Electronics', category_id: 1, status: false },
  { product_id: 12, product_name: 'Water Bottle', description: 'Double-walled insulated steel bottle – keeps cold 24h.', price: 499, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', category_name: 'Sports', category_id: 5, status: true },
];

const MOCK_CATEGORIES = [
  { category_id: 1, category_name: 'Electronics' },
  { category_id: 2, category_name: 'Footwear' },
  { category_id: 3, category_name: 'Bags' },
  { category_id: 4, category_name: 'Accessories' },
  { category_id: 5, category_name: 'Sports' },
  { category_id: 6, category_name: 'Kitchen' },
];

const SORT_OPTIONS = [
  { value: 'default',     label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name: A → Z' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts,  setAllProducts]  = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [sort,         setSort]         = useState('default');
  const selectedCat = searchParams.get('category') ? Number(searchParams.get('category')) : null;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getAllProducts(), getAllCategories()]);
        setAllProducts(pRes.data);
        setCategories(cRes.data.filter(c => c.status));
      } catch {
        setAllProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = allProducts
    .filter(p => !selectedCat || p.category_id === selectedCat)
    .filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name-asc')   return a.product_name.localeCompare(b.product_name);
      return 0;
    });

  const setCategory = (id) => {
    if (id === null) searchParams.delete('category');
    else searchParams.set('category', id);
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <h1 className="section-title">All Products</h1>
          <p className="section-sub">{filtered.length} items found</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3 className="filter-title">Categories</h3>
            <ul className="cat-filter-list">
              <li>
                <button
                  className={`cat-filter-btn ${!selectedCat ? 'active' : ''}`}
                  onClick={() => setCategory(null)}
                  id="cat-all-btn"
                >All Products</button>
              </li>
              {categories.map(c => (
                <li key={c.category_id}>
                  <button
                    className={`cat-filter-btn ${selectedCat === c.category_id ? 'active' : ''}`}
                    onClick={() => setCategory(c.category_id)}
                    id={`cat-filter-${c.category_id}`}
                  >{c.category_name}</button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            {/* Search + Sort bar */}
            <div className="search-sort-bar">
              <input
                id="product-search"
                type="text"
                className="form-control search-input"
                placeholder="🔍  Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                id="product-sort"
                className="form-control sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {loading ? <Loader /> : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different search or category filter.</p>
              </div>
            ) : (
              <div className="grid-4">
                {filtered.map(p => <ProductCard key={p.product_id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
