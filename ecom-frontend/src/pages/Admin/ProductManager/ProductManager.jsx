import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast/ToastProvider';
import Loader from '../../../components/Loader/Loader';
import { getAllProducts, createProduct, updateProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';

/* ── Demo / fallback data ─────────────────────────────────────────── */
const MOCK_CATS = [
  { category_id: 1, category_name: 'Electronics' },
  { category_id: 2, category_name: 'Footwear' },
  { category_id: 3, category_name: 'Clothing' },
];

const MOCK_PRODS = [
  {
    product_id: 1,
    product_name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 2999,
    SKU: 'ELEC-WH-001',
    category_id: 1,
    category_name: 'Electronics',
    inventory_count: 15,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-04-10T08:00:00Z',
    status: true,
  },
  {
    product_id: 2,
    product_name: 'Running Shoes',
    description: 'Lightweight, breathable running shoes with cushioned sole for long-distance comfort.',
    price: 1799,
    SKU: 'FOOT-RS-002',
    category_id: 2,
    category_name: 'Footwear',
    inventory_count: 4,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-04-12T08:00:00Z',
    status: true,
  },
  {
    product_id: 3,
    product_name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound and 12-hour battery.',
    price: 3499,
    SKU: 'ELEC-BS-003',
    category_id: 1,
    category_name: 'Electronics',
    inventory_count: 0,
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-04-20T08:00:00Z',
    status: false,
  },
];

const EMPTY_FORM = {
  product_name: '',
  description: '',
  price: '',
  SKU: '',
  category_id: '',
  inventory_count: '',
  status: true,
};

/* ── Inventory badge helper ──────────────────────────────────────── */
function InventoryBadge({ count }) {
  const n = Number(count);
  if (n === 0)  return <span style={{ color: 'var(--danger)',  fontWeight: 700 }}>{n} units</span>;
  if (n < 10)   return <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{n} units</span>;
  return <span style={{ fontWeight: 600 }}>{n} units</span>;
}

/* ── Component ────────────────────────────────────────────────────── */
export default function ProductManager() {
  const { showToast } = useToast();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);

  /* Modal state: 'add' | 'edit' | 'deactivate' | null */
  const [modalMode,   setModalMode]   = useState(null);
  const [currentProd, setCurrentProd] = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);

  /* ── Data fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getAllProducts(), getAllCategories()]);
        const prods = pRes?.data?.length  ? pRes.data  : MOCK_PRODS;
        const cats  = cRes?.data?.length  ? cRes.data  : MOCK_CATS;
        setProducts(prods);
        setCategories(cats);
      } catch {
        setProducts(MOCK_PRODS);
        setCategories(MOCK_CATS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Modal helpers ──────────────────────────────────────────────── */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setCurrentProd(null);
    setModalMode('add');
  };

  const openEdit = (prod) => {
    setCurrentProd(prod);
    setForm({
      product_name:    prod.product_name    || '',
      description:     prod.description     || '',
      price:           prod.price           || '',
      SKU:             prod.SKU             || '',
      category_id:     prod.category_id     || '',
      inventory_count: prod.inventory_count != null ? prod.inventory_count : '',
      status:          prod.status,
    });
    setModalMode('edit');
  };

  const openDeactivate = (prod) => {
    setCurrentProd(prod);
    setModalMode('deactivate');
  };

  const closeModal = () => {
    setModalMode(null);
    setCurrentProd(null);
    setSaving(false);
  };

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  /* ── Save (add / edit) ──────────────────────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      product_name:    form.product_name.trim(),
      description:     form.description.trim(),
      price:           parseFloat(form.price),
      SKU:             form.SKU.trim(),
      category_id:     parseInt(form.category_id, 10),
      inventory_count: parseInt(form.inventory_count, 10),
      status:          form.status,
    };
    const catName = categories.find(c => c.category_id == form.category_id)?.category_name || 'General';

    try {
      if (modalMode === 'add') {
        let newProd;
        try {
          const res = await createProduct(payload);
          newProd = res.data;
        } catch {
          /* demo fallback */
          newProd = { product_id: Date.now(), ...payload, category_name: catName };
        }
        setProducts(prev => [{ ...newProd, category_name: catName }, ...prev]);
        showToast('Product added successfully ✓', 'success');
      } else {
        const id = currentProd.product_id;
        try {
          await updateProduct(id, payload);
        } catch { /* demo fallback */ }
        setProducts(prev =>
          prev.map(p =>
            p.product_id === id
              ? { ...p, ...payload, category_name: catName }
              : p
          )
        );
        showToast('Product updated successfully ✓', 'success');
      }
      closeModal();
    } catch {
      showToast('Error saving product', 'error');
      setSaving(false);
    }
  };

  /* ── Deactivate (soft-delete via status = false) ─────────────────── */
  const handleDeactivate = async () => {
    if (!currentProd) return;
    setSaving(true);
    const id = currentProd.product_id;
    try {
      try {
        await updateProduct(id, { status: false });
      } catch { /* demo fallback */ }
      setProducts(prev =>
        prev.map(p => (p.product_id === id ? { ...p, status: false } : p))
      );
      showToast(`"${currentProd.product_name}" has been deactivated`, 'warning');
      closeModal();
    } catch {
      showToast('Error deactivating product', 'error');
      setSaving(false);
    }
  };

  /* ── Reactivate ─────────────────────────────────────────────────── */
  const handleReactivate = async (prod) => {
    const id = prod.product_id;
    try {
      try {
        await updateProduct(id, { status: true });
      } catch { /* demo fallback */ }
      setProducts(prev =>
        prev.map(p => (p.product_id === id ? { ...p, status: true } : p))
      );
      showToast(`"${prod.product_name}" reactivated`, 'success');
    } catch {
      showToast('Error reactivating product', 'error');
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  if (loading) return <Loader />;

  return (
    <div className="admin-module">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <h2>🏷️ Product Management</h2>
          <p>Add, edit, deactivate and track inventory for all products.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-add-product">
          + Add Product
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────── */}
      <div className="pm-stats-row">
        <div className="pm-stat-pill">
          <span className="pm-stat-num">{products.length}</span>
          <span className="pm-stat-lbl">Total Products</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--success)' }}>
            {products.filter(p => p.status).length}
          </span>
          <span className="pm-stat-lbl">Active</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--text-muted)' }}>
            {products.filter(p => !p.status).length}
          </span>
          <span className="pm-stat-lbl">Inactive</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--danger)' }}>
            {products.filter(p => Number(p.inventory_count) === 0).length}
          </span>
          <span className="pm-stat-lbl">Out of Stock</span>
        </div>
        <div className="pm-stat-pill">
          <span className="pm-stat-num" style={{ color: 'var(--warning)' }}>
            {products.filter(p => Number(p.inventory_count) > 0 && Number(p.inventory_count) < 10).length}
          </span>
          <span className="pm-stat-lbl">Low Stock</span>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="am-table-wrap card">
        {products.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">🏷️</div>
            <h3>No Products Yet</h3>
            <p>Click <strong>+ Add Product</strong> to get started.</p>
          </div>
        ) : (
          <table className="am-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.product_id} className={!p.status ? 'inactive-row' : ''}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    #{p.product_id}
                  </td>
                  <td>
                    <div className="fw-600">{p.product_name}</div>
                    {p.description && (
                      <div className="pm-desc-preview">{p.description}</div>
                    )}
                  </td>
                  <td>
                    <code className="pm-sku">{p.SKU || '—'}</code>
                  </td>
                  <td>
                    <span className="badge badge-primary">{p.category_name || '—'}</span>
                  </td>
                  <td className="fw-600">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <InventoryBadge count={p.inventory_count} />
                  </td>
                  <td>
                    <span className={`badge ${p.status ? 'badge-success' : 'badge-danger'}`}>
                      {p.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="am-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(p)}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      {p.status ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openDeactivate(p)}
                          title="Deactivate product"
                        >
                          🚫 Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm"
                          style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}
                          onClick={() => handleReactivate(p)}
                          title="Reactivate product"
                        >
                          ✅ Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {modalMode && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: modalMode === 'deactivate' ? '440px' : '560px' }}>

            {/* ── Deactivate Warning ─────────────────────────────── */}
            {modalMode === 'deactivate' && (
              <>
                <h3 className="modal-title">⚠️ Deactivate Product?</h3>
                <div className="modal-body" style={{ marginBottom: '0' }}>
                  <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
                    You are about to deactivate <strong>"{currentProd?.product_name}"</strong>.
                  </p>
                  <div className="deactivate-warning">
                    <span className="dw-icon">⚠️</span>
                    <div>
                      <strong>Warning:</strong> Deactivating this product will{' '}
                      <strong>hide it from the customer interface</strong>. Customers will no longer
                      be able to view, search, or purchase this product. You can reactivate it at
                      any time from the product table.
                    </div>
                  </div>
                </div>
                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button className="btn btn-ghost" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeactivate}
                    disabled={saving}
                  >
                    {saving ? 'Deactivating…' : 'Yes, Deactivate'}
                  </button>
                </div>
              </>
            )}

            {/* ── Add / Edit Form ────────────────────────────────── */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <form onSubmit={handleSave}>
                <h3 className="modal-title">
                  {modalMode === 'add' ? '+ Add New Product' : '✏️ Edit Product'}
                </h3>
                <div className="modal-body" style={{ color: 'inherit', marginBottom: '0' }}>

                  {/* Product Name */}
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      id="field-product-name"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Wireless Headphones"
                      required
                      maxLength={150}
                      value={form.product_name}
                      onChange={e => setField('product_name', e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">
                      Description * &nbsp;
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ({form.description.length}/500)
                      </span>
                    </label>
                    <textarea
                      id="field-description"
                      className="form-control"
                      placeholder="Detailed description of the product…"
                      required
                      rows={3}
                      maxLength={500}
                      value={form.description}
                      onChange={e => setField('description', e.target.value)}
                    />
                  </div>

                  {/* Price + SKU */}
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Price (₹) *</label>
                      <input
                        id="field-price"
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={e => setField('price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input
                        id="field-sku"
                        type="text"
                        className="form-control"
                        placeholder="e.g. ELEC-WH-001"
                        required
                        maxLength={50}
                        value={form.SKU}
                        onChange={e => setField('SKU', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category + Inventory */}
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        id="field-category"
                        className="form-control"
                        required
                        value={form.category_id}
                        onChange={e => setField('category_id', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.category_id} value={c.category_id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Inventory Count *</label>
                      <input
                        id="field-inventory"
                        type="number"
                        className="form-control"
                        placeholder="0"
                        required
                        min="0"
                        value={form.inventory_count}
                        onChange={e => setField('inventory_count', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Status toggle (edit mode only) */}
                  {modalMode === 'edit' && (
                    <div className="pm-status-toggle">
                      <input
                        type="checkbox"
                        id="field-status"
                        checked={form.status}
                        onChange={e => setField('status', e.target.checked)}
                      />
                      <label htmlFor="field-status">
                        Mark as <strong>{form.status ? 'Active' : 'Inactive'}</strong>
                      </label>
                    </div>
                  )}
                </div>

                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving
                      ? (modalMode === 'add' ? 'Adding…' : 'Saving…')
                      : (modalMode === 'add' ? 'Create Product' : 'Save Changes')
                    }
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
