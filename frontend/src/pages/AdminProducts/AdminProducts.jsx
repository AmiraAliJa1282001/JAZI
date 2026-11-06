import { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, Plus, RefreshCw, ChevronLeft, ChevronRight,
  Pencil, X, ImageOff, Package, CheckCircle2,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import {
  getAdminProducts, getAdminCategories, createAdminProduct,
  updateAdminProduct,
} from "../../services/websiteApi";
import "./AdminProducts.css";

const emptyForm = {
  category: "", name: "", name_ar: "", description: "", description_ar: "",
  price: "", display_order: "0", is_available: true, is_active: true,
  is_best_seller: false, is_new: false,
};
const money = (value) => `${Number(value || 0).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`;
const readError = (error) => error?.message || "Something went wrong. Please try again.";

function ProductEditor({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(() => product ? {
    category: String(product.category ?? ""), name: product.name ?? "", name_ar: product.name_ar ?? "",
    description: product.description ?? "", description_ar: product.description_ar ?? "",
    price: String(product.price ?? ""), display_order: String(product.display_order ?? 0),
    is_available: Boolean(product.is_available), is_active: Boolean(product.is_active),
    is_best_seller: Boolean(product.is_best_seller), is_new: Boolean(product.is_new),
  } : { ...emptyForm });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product?.image_url || product?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) return undefined;
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (!form.category || !form.name.trim() || form.price === "") {
      setError("Category, product name and price are required.");
      return;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setError("Enter a valid non-negative price.");
      return;
    }
    const payload = new FormData();
    ["category", "name", "name_ar", "description", "description_ar", "price", "display_order"].forEach((key) => {
      payload.append(key, typeof form[key] === "string" ? form[key].trim() : String(form[key]));
    });
    ["is_available", "is_active", "is_best_seller", "is_new"].forEach((key) => {
      payload.append(key, String(form[key]));
    });
    if (image) payload.append("image", image);
    try {
      setSaving(true);
      if (product) await updateAdminProduct(product.id, payload);
      else await createAdminProduct(payload);
      onSaved();
    } catch (err) {
      setError(readError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ap-overlay" onMouseDown={() => !saving && onClose()}>
      <aside className="ap-drawer" role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add product"} onMouseDown={(event) => event.stopPropagation()}>
        <div className="ap-drawer-header">
          <div><span className="ap-eyebrow">PRODUCT MANAGEMENT</span><h2>{product ? "Edit Product" : "Add New Product"}</h2></div>
          <button className="ap-icon-btn" type="button" disabled={saving} onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form className="ap-form" onSubmit={submit}>
          <label className="ap-field">Product Image
            <div className="ap-image-preview">{preview ? <img src={preview} alt="Product preview" /> : <ImageOff size={30} />}</div>
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
            <small>JPG, PNG or WebP. Leave empty to keep the existing image.</small>
          </label>
          <label className="ap-field">Category <span className="ap-required">*</span>
            <select name="category" value={form.category} onChange={change} required>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}{!category.is_active ? " (Inactive)" : ""}</option>)}
            </select>
          </label>
          <div className="ap-form-grid">
            <label className="ap-field">Name (English) <span className="ap-required">*</span><input name="name" value={form.name} onChange={change} maxLength={150} required /></label>
            <label className="ap-field">Name (Arabic)<input name="name_ar" value={form.name_ar} onChange={change} maxLength={150} dir="auto" /></label>
          </div>
          <label className="ap-field">Description (English)<textarea name="description" rows={3} value={form.description} onChange={change} /></label>
          <label className="ap-field">Description (Arabic)<textarea name="description_ar" rows={3} value={form.description_ar} onChange={change} dir="auto" /></label>
          <div className="ap-form-grid">
            <label className="ap-field">Price (AED) <span className="ap-required">*</span><input type="number" name="price" min="0" max="999999.99" step="0.01" value={form.price} onChange={change} required /></label>
            <label className="ap-field">Display Order<input type="number" name="display_order" min="0" step="1" value={form.display_order} onChange={change} required /></label>
          </div>
          <div className="ap-switches">
            {[
              ["is_available", "Available for ordering"],
              ["is_active", "Visible on menu"],
              ["is_best_seller", "Best seller"],
              ["is_new", "New arrival"],
            ].map(([name, label]) => <label className="ap-checkbox" key={name}><input type="checkbox" name={name} checked={form[name]} onChange={change} /><span>{label}</span></label>)}
          </div>
          {error && <div className="ap-error" role="alert">{error}</div>}
          <div className="ap-form-actions"><button type="button" className="ap-secondary" onClick={onClose} disabled={saving}>Cancel</button><button className="ap-primary" type="submit" disabled={saving}>{saving ? "Saving..." : product ? "Save Changes" : "Create Product"}</button></div>
        </form>
      </aside>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState("");
  const [available, setAvailable] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState("");
  const totalPages = Math.max(1, Math.ceil(count / 10));
  const filters = useMemo(() => ({ search, category, is_active: active, is_available: available, page, page_size: 10 }), [search, category, active, available, page]);

  useEffect(() => {
    const controller = new AbortController();
    getAdminCategories(controller.signal).then((data) => {
      if (!controller.signal.aborted) setCategories(Array.isArray(data) ? data : data.results || []);
    }).catch((err) => { if (!controller.signal.aborted) setError(readError(err)); });
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getAdminProducts(filters, controller.signal)
      .then((data) => { if (!controller.signal.aborted) { setProducts(data.results || []); setCount(data.count || 0); } })
      .catch((err) => { if (!controller.signal.aborted) setError(readError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, refresh]);

  async function quickUpdate(product, key) {
    if (updatingId !== null) return;
    setError(""); setNotice(""); setUpdatingId(product.id);
    const payload = new FormData();
    payload.append(key, String(!product[key]));
    try {
      await updateAdminProduct(product.id, payload);
      setNotice(`${product.name} updated successfully.`);
      setRefresh((value) => value + 1);
    } catch (err) { setError(readError(err)); }
    finally { setUpdatingId(null); }
  }

  const reset = () => { setSearchInput(""); setSearch(""); setCategory(""); setActive(""); setAvailable(""); setPage(1); };
  const saved = () => { setEditor(null); setNotice("Product saved successfully."); setRefresh((value) => value + 1); };

  return (
    <div className="ap-page"><AdminSidebar /><main className="ap-main">
      <header className="ap-heading"><div><span className="ap-eyebrow">JAZI ADMIN PANEL</span><h1>Products Management</h1><p>Manage your menu, pricing and product visibility.</p></div>
        <div className="ap-header-actions"><button type="button" className="ap-secondary" onClick={() => setRefresh((value) => value + 1)}><RefreshCw size={16} /> Refresh</button><button type="button" className="ap-primary" onClick={() => setEditor({ mode: "create" })}><Plus size={17} /> Add Product</button></div>
      </header>
      <section className="ap-panel"><div className="ap-panel-heading"><div><span className="ap-eyebrow">MENU INVENTORY</span><h2>All Products</h2><p>{count} products found</p></div><Package size={27} strokeWidth={1.5} /></div>
        <form className="ap-search" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }}><Search size={17} /><input aria-label="Search products" placeholder="Search product name or category..." value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /><button type="submit" className="ap-primary">Search</button></form>
        <div className="ap-filters"><Filter size={17} /><select aria-label="Filter category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="">All Categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <select aria-label="Filter visibility" value={active} onChange={(event) => { setActive(event.target.value); setPage(1); }}><option value="">All Visibility</option><option value="true">Visible</option><option value="false">Hidden</option></select>
          <select aria-label="Filter availability" value={available} onChange={(event) => { setAvailable(event.target.value); setPage(1); }}><option value="">All Availability</option><option value="true">Available</option><option value="false">Unavailable</option></select>
          <button type="button" className="ap-clear" onClick={reset}>Clear filters</button>
        </div>
        {error && <div className="ap-error" role="alert">{error}</div>}
        {notice && <div className="ap-notice" role="status"><CheckCircle2 size={16} /> {notice}</div>}
        {loading ? <div className="ap-empty">Loading products...</div> : products.length === 0 ? <div className="ap-empty"><Package size={34} /><strong>No products found</strong><span>Try different filters or add a new product.</span></div> :
          <div className="ap-table-wrap"><table className="ap-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABILITY</th><th>VISIBILITY</th><th>LABELS</th><th>ACTIONS</th></tr></thead><tbody>
            {products.map((product) => <tr key={product.id}><td><div className="ap-product-cell"><div className="ap-thumb">{(product.image_url || product.image) ? <img src={product.image_url || product.image} alt="" /> : <ImageOff size={20} />}</div><div><strong>{product.name}</strong>{product.name_ar && <small dir="auto">{product.name_ar}</small>}</div></div></td>
              <td>{product.category_name || "—"}</td><td className="ap-price">{money(product.price)}</td>
              <td><button type="button" className={`ap-pill ${product.is_available ? "ap-yes" : "ap-no"}`} disabled={updatingId !== null} onClick={() => quickUpdate(product, "is_available")}>{product.is_available ? "Available" : "Unavailable"}</button></td>
              <td><button type="button" className={`ap-pill ${product.is_active ? "ap-yes" : "ap-no"}`} disabled={updatingId !== null} onClick={() => quickUpdate(product, "is_active")}>{product.is_active ? "Visible" : "Hidden"}</button></td>
              <td><div className="ap-tags">{product.is_best_seller && <span>Best Seller</span>}{product.is_new && <span>New</span>}{!product.is_best_seller && !product.is_new && "—"}</div></td>
              <td><button type="button" className="ap-edit" onClick={() => setEditor({ mode: "edit", product })}><Pencil size={15} /> Edit</button></td></tr>)}
          </tbody></table></div>}
        <footer className="ap-pagination"><span>Page {page} of {totalPages} · {count} products</span><div><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} aria-label="Previous page"><ChevronLeft size={18} /></button><button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)} aria-label="Next page"><ChevronRight size={18} /></button></div></footer>
      </section>
    </main>{editor && <ProductEditor key={editor.mode === "edit" ? editor.product.id : "new"} product={editor.product || null} categories={categories} onClose={() => setEditor(null)} onSaved={saved} />}</div>
  );
}
