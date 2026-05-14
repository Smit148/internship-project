import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';
import { getAllProducts } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';

const MOCK_PRODS = [
  { product_id: 1, product_name: 'Wireless Headphones', price: 2999, stock: 15, category_name: 'Electronics', status: true },
  { product_id: 2, product_name: 'Running Shoes', price: 1799, stock: 4, category_name: 'Footwear', status: true },
  { product_id: 3, product_name: 'Bluetooth Speaker', price: 3499, stock: 0, category_name: 'Electronics', status: false },
];

export default function ProductManager() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentProd, setCurrentProd] = useState(null);
  const [form, setForm] = useState({ product_name: '', price: '', stock: '', category_id: '', description: '', status: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getAllProducts(), getAllCategories()]);
        setProducts(pRes.data.length ? pRes.data : MOCK_PRODS);
        setCategories(cRes.data);
      } catch {
        setProducts(MOCK_PRODS);
        setCategories([{category_id: 1, category_name: 'Electronics'}, {category_id: 2, category_name: 'Footwear'}]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAdd = () => {
    setForm({ product_name: '', price: '', stock: '', category_id: '', description: '', status: true });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEdit = (prod) => {
    setCurrentProd(prod);
    setForm({ product_name: prod.product_name, price: prod.price, stock: prod.stock, category_id: prod.category_id || '', description: prod.description || '', status: prod.status });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setCurrentProd(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // await createProduct(form);
        const newP = { product_id: Date.now(), ...form, category_name: categories.find(c => c.category_id == form.category_id)?.category_name || 'General' };
        setProducts([...products, newP]);
        showToast('Product added successfully', 'success');
      } else {
        // await updateProduct(currentProd.product_id, form);
        setProducts(products.map(p => p.product_id === currentProd.product_id ? { ...p, ...form, category_name: categories.find(c => c.category_id == form.category_id)?.category_name || p.category_name } : p));
        showToast('Product updated successfully', 'success');
      }
      closeModal();
    } catch {
      showToast('Error saving product', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-module">
      <div className="am-header">
        <div>
          <h2>🏷️ Product Management</h2>
          <p>Add, edit, and track inventory for all products.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="am-table-wrap card">
        <table className="am-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_id} className={!p.status ? 'inactive-row' : ''}>
                <td>#{p.product_id}</td>
                <td className="fw-600">{p.product_name}</td>
                <td><span className="badge badge-primary">{p.category_name}</span></td>
                <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                <td>
                    <span style={{color: p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? 'var(--warning)' : 'inherit', fontWeight: 'bold'}}>
                        {p.stock} units
                    </span>
                </td>
                <td>
                  <span className={`badge ${p.status ? 'badge-success' : 'badge-danger'}`}>
                    {p.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="am-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSave}>
              <h3 className="modal-title">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input type="text" className="form-control" required value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} />
                </div>
                <div className="grid-2">
                    <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" className="form-control" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input type="number" className="form-control" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                    </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                  </select>
                </div>
                {modalMode === 'edit' && (
                  <div className="form-group" style={{flexDirection:'row', alignItems:'center', gap:'0.5rem', marginTop:'1rem'}}>
                    <input type="checkbox" id="prod-status" checked={form.status} onChange={e => setForm({...form, status: e.target.checked})} />
                    <label htmlFor="prod-status" className="form-label">Active Status</label>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Create Product' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
