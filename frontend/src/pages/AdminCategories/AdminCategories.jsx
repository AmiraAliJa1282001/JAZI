import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Pencil,
  X,
  Tags,
  CheckCircle2,
  ChevronDown,
  Trash2
} from "lucide-react";

import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from "../../services/websiteApi";

import "./AdminCategories.css";

const emptyForm = {
  name: "",
  name_ar: "",
  display_order: "0",
  is_active: true,
};

const readError = (error) =>
  error?.message || "Something went wrong. Please try again.";

function CategoryEditor({ category, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    category
      ? {
          name: category.name ?? "",
          name_ar: category.name_ar ?? "",
          display_order: String(category.display_order ?? 0),
          is_active: Boolean(category.is_active),
        }
      : { ...emptyForm }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function change(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
 
  async function submit(event) {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const order = Number(form.display_order);

    if (!Number.isInteger(order) || order < 0) {
      setError("Display order must be a non-negative integer.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      name_ar: form.name_ar.trim(),
      display_order: order,
      is_active: form.is_active,
    };

    try {
      setSaving(true);

      if (category) {
        await updateAdminCategory(category.id, payload);
      } else {
        await createAdminCategory(payload);
      }

      onSaved();
    } catch (err) {
      setError(readError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="ac-overlay"
      onMouseDown={() => !saving && onClose()}
    >
      <aside
        className="ac-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={category ? "Edit category" : "Add category"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ac-drawer-header">
          <div>
            <span className="ac-eyebrow">CATEGORY MANAGEMENT</span>
            <h2>{category ? "Edit Category" : "Add New Category"}</h2>
          </div>

          <button
            className="ac-icon-btn"
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form className="ac-form" onSubmit={submit}>
          <label className="ac-field">
            Category Name (English)
            <span className="ac-required">*</span>
            <input
              name="name"
              value={form.name}
              onChange={change}
              maxLength={150}
              required
              placeholder="e.g. Seafood"
            />
          </label>

          <label className="ac-field">
            Category Name (Arabic)
            <input
              name="name_ar"
              value={form.name_ar}
              onChange={change}
              maxLength={150}
              dir="auto"
              placeholder="مثلاً: مأكولات بحرية"
            />
          </label>

          <label className="ac-field">
            Display Order
            <input
              type="number"
              name="display_order"
              min="0"
              step="1"
              value={form.display_order}
              onChange={change}
              required
            />
            <small>
              Categories with a lower number appear first.
            </small>
          </label>

          <label className="ac-checkbox">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={change}
            />
            <span>Active — visible on the menu</span>
          </label>

          {error && (
            <div className="ac-error" role="alert">
              {error}
            </div>
          )}

          <div className="ac-form-actions">
            <button
              type="button"
              className="ac-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="ac-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : category
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    getAdminCategories(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        setCategories(
          Array.isArray(data) ? data : data.results || []
        );
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(readError(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [refresh]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name?.toLowerCase().includes(normalizedSearch) ||
        category.name_ar?.toLowerCase().includes(normalizedSearch);

      const matchesActive =
        activeFilter === "" ||
        String(category.is_active) === activeFilter;

      return matchesSearch && matchesActive;
    });
  }, [categories, search, activeFilter]);

  async function toggleActive(category) {
    if (updatingId !== null) return;

    setError("");
    setNotice("");
    setUpdatingId(category.id);

    try {
      await updateAdminCategory(category.id, {
        is_active: !category.is_active,
      });

      setNotice(`${category.name} updated successfully.`);
      setRefresh((value) => value + 1);
    } catch (err) {
      setError(readError(err));
    } finally {
      setUpdatingId(null);
    }
  }
  async function handleDelete(category) {
  if (category.products_count > 0) {
    setError(
      "This category contains products. Move or remove them first."
    );
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${category.name}"?`
  );

  if (!confirmed) return;

  setError("");
  setNotice("");

  try {
    await deleteAdminCategory(category.id);

    setNotice(`${category.name} deleted successfully.`);
    setRefresh((value) => value + 1);
  } catch (err) {
    setError(readError(err));
  }
}

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setActiveFilter("");
  }

  function saved() {
    setEditor(null);
    setNotice("Category saved successfully.");
    setRefresh((value) => value + 1);
  }

  return (
    <div className="ac-page">
      <AdminSidebar />

      <main className="ac-main">
        <header className="ac-heading">
          <div>
            <span className="ac-eyebrow">JAZI ADMIN PANEL</span>
            <h1>Categories Management</h1>
            <p>Organize your menu categories and their visibility.</p>
          </div>

          <div className="ac-header-actions">
            <button
              type="button"
              className="ac-secondary"
              onClick={() => setRefresh((value) => value + 1)}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              className="ac-primary"
              onClick={() => setEditor({ mode: "create" })}
            >
              <Plus size={17} />
              Add Category
            </button>
          </div>
        </header>

        <section className="ac-panel">
          <div className="ac-panel-heading">
            <div>
              <span className="ac-eyebrow">MENU ORGANIZATION</span>
              <h2>All Categories</h2>
              <p>{filteredCategories.length} categories found</p>
            </div>

            <Tags size={27} strokeWidth={1.5} />
          </div>

          <form
            className="ac-search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <Search size={17} />

            <input
              aria-label="Search categories"
              placeholder="Search category name..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            <button type="submit" className="ac-primary">
              Search
            </button>
          </form>

          <div className="ac-filters">
            <Filter size={17} />

            <select
              aria-label="Filter category status"
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button
              type="button"
              className="ac-clear"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>

          {error && (
            <div className="ac-error" role="alert">
              {error}
            </div>
          )}

          {notice && (
            <div className="ac-notice" role="status">
              <CheckCircle2 size={16} />
              {notice}
            </div>
          )}

          {loading ? (
            <div className="ac-empty">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="ac-empty">
              <Tags size={34} />
              <strong>No categories found</strong>
              <span>Try another search or add a new category.</span>
            </div>
          ) : (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CATEGORY</th>
                    <th>PRODUCTS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="ac-order">
                        {category.display_order}
                      </td>

                      <td>
                        <div className="ac-category-cell">
                          <div className="ac-category-icon">
                            <Tags size={19} />
                          </div>

                          <div>
                            <strong>{category.name}</strong>

                            {category.name_ar && (
                              <small dir="auto">
                                {category.name_ar}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="ac-count">
                          {category.products_count ?? 0}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`ac-pill ${
                            category.is_active ? "ac-yes" : "ac-no"
                          }`}
                          disabled={updatingId !== null}
                          onClick={() => toggleActive(category)}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="ac-edit"
                          onClick={() =>
                            setEditor({ mode: "edit", category })
                          }
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                            type="button"
                            className="ac-delete"
                            disabled={category.products_count > 0}
                            title={
                                category.products_count > 0
                                ? "Move or remove products before deleting this category"
                                : "Delete category"
                            }
                            onClick={() => handleDelete(category)}
                            >
                            <Trash2 size={15} />
                            Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="ac-table-footer">
            <span>
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
          </footer>
        </section>
      </main>

      {editor && (
        <CategoryEditor
          key={
            editor.mode === "edit"
              ? editor.category.id
              : "new-category"
          }
          category={editor.category || null}
          onClose={() => setEditor(null)}
          onSaved={saved}
        />
      )}
    </div>
  );
}