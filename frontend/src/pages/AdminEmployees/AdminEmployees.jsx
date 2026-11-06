
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Pencil,
  X,
  Users,
  CheckCircle2,
  Trash2,
  UserRound,
  KeyRound,
} from "lucide-react";

import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

import {
  getAdminEmployees,
  createAdminEmployee,
  updateAdminEmployee,
  deleteAdminEmployee,
} from "../../services/websiteApi";

import "./AdminEmployees.css";

const emptyForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  is_active: true,
};

const readError = (error) =>
  error?.message || "Something went wrong. Please try again.";

const employeeName = (employee) =>
  [employee.first_name, employee.last_name]
    .filter(Boolean)
    .join(" ") || employee.username;

function EmployeeEditor({ employee, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    employee
      ? {
          username: employee.username || "",
          first_name: employee.first_name || "",
          last_name: employee.last_name || "",
          email: employee.email || "",
          password: "",
          is_active: Boolean(employee.is_active),
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

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!employee && !form.password) {
      setError("Password is required.");
      return;
    }

    const payload = {
      username: form.username.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      is_active: form.is_active,
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      setSaving(true);

      if (employee) {
        await updateAdminEmployee(employee.id, payload);
      } else {
        await createAdminEmployee(payload);
      }

      onSaved(
        employee
          ? "Employee updated successfully."
          : "Employee created successfully."
      );
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
        aria-label={employee ? "Edit employee" : "Add employee"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ac-drawer-header">
          <div>
            <span className="ac-eyebrow">
              EMPLOYEE MANAGEMENT
            </span>
            <h2>
              {employee ? "Edit Employee" : "Add New Employee"}
            </h2>
          </div>

          <button
            type="button"
            className="ac-icon-btn"
            disabled={saving}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form className="ac-form" onSubmit={submit}>
          <label className="ac-field">
            Username *
            <input
              name="username"
              value={form.username}
              onChange={change}
              maxLength={150}
              required
              autoComplete="off"
              placeholder="e.g. ahmad.staff"
            />
          </label>

          <div className="ae-field-grid">
            <label className="ac-field">
              First Name
              <input
                name="first_name"
                value={form.first_name}
                onChange={change}
                maxLength={150}
                placeholder="First name"
              />
            </label>

            <label className="ac-field">
              Last Name
              <input
                name="last_name"
                value={form.last_name}
                onChange={change}
                maxLength={150}
                placeholder="Last name"
              />
            </label>
          </div>

          <label className="ac-field">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              maxLength={254}
              placeholder="employee@example.com"
            />
          </label>

          <label className="ac-field">
            {employee ? "New Password (optional)" : "Password *"}

            <div className="ae-password-wrap">
              <KeyRound size={17} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={change}
                autoComplete="new-password"
                required={!employee}
                placeholder={
                  employee
                    ? "Leave blank to keep current password"
                    : "Create a secure password"
                }
              />
            </div>

            <small>
              {employee
                ? "Enter a password only if you want to change it."
                : "Use a strong and unique password."}
            </small>
          </label>

          <label className="ac-checkbox">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={change}
            />
            <span>Active — employee can sign in</span>
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
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ac-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : employee
                ? "Save Changes"
                : "Create Employee"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);

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

    getAdminEmployees(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        setEmployees(
          Array.isArray(data) ? data : data?.results || []
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

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        [
          employee.username,
          employee.first_name,
          employee.last_name,
          employee.email,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        activeFilter === "" ||
        String(employee.is_active) === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, activeFilter]);

  async function toggleActive(employee) {
    if (updatingId !== null) return;

    setError("");
    setNotice("");
    setUpdatingId(employee.id);

    try {
      await updateAdminEmployee(employee.id, {
        is_active: !employee.is_active,
      });

      setNotice(
        `${employee.username} ${
          employee.is_active ? "deactivated" : "activated"
        } successfully.`
      );

      setRefresh((value) => value + 1);
    } catch (err) {
      setError(readError(err));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(employee) {
    if (updatingId !== null) return;

    const confirmed = window.confirm(
      `Permanently delete employee "${employee.username}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setUpdatingId(employee.id);

    try {
      await deleteAdminEmployee(employee.id);

      setNotice(`${employee.username} deleted successfully.`);
      setRefresh((value) => value + 1);
    } catch (err) {
      setError(readError(err));
    } finally {
      setUpdatingId(null);
    }
  }

  function saved(message) {
    setEditor(null);
    setNotice(message);
    setRefresh((value) => value + 1);
  }

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setActiveFilter("");
  }

  return (
    <div className="ac-page ae-page">
      <AdminSidebar />

      <main className="ac-main">
        <header className="ac-heading">
          <div>
            <span className="ac-eyebrow">JAZI ADMIN PANEL</span>
            <h1>Employee Management</h1>
            <p>
              Manage staff accounts, access, and employee details.
            </p>
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
              Add Employee
            </button>
          </div>
        </header>

        <section className="ac-panel">
          <div className="ac-panel-heading">
            <div>
              <span className="ac-eyebrow">
                TEAM ADMINISTRATION
              </span>
              <h2>All Employees</h2>
              <p>{filteredEmployees.length} employees found</p>
            </div>

            <Users size={27} strokeWidth={1.5} />
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
              aria-label="Search employees"
              placeholder="Search name, username, or email..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />

            <button type="submit" className="ac-primary">
              Search
            </button>
          </form>

          <div className="ac-filters">
            <Filter size={17} />

            <select
              aria-label="Filter employee status"
              value={activeFilter}
              onChange={(event) =>
                setActiveFilter(event.target.value)
              }
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
            <div className="ac-empty">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="ac-empty">
              <Users size={34} />
              <strong>No employees found</strong>
              <span>
                Try another search or add a new employee.
              </span>
            </div>
          ) : (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>USERNAME</th>
                    <th>EMAIL</th>
                    <th>JOINED</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="ae-employee-cell">
                          <div className="ac-category-icon">
                            <UserRound size={19} />
                          </div>

                          <strong>
                            {employeeName(employee)}
                          </strong>
                        </div>
                      </td>

                      <td className="ac-order">
                        @{employee.username}
                      </td>

                      <td>{employee.email || "—"}</td>

                      <td>
                        {employee.date_joined
                          ? new Date(
                              employee.date_joined
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`ac-pill ${
                            employee.is_active
                              ? "ac-yes"
                              : "ac-no"
                          }`}
                          disabled={updatingId !== null}
                          onClick={() =>
                            toggleActive(employee)
                          }
                        >
                          {employee.is_active
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td>
                        <div className="ae-actions">
                          <button
                            type="button"
                            className="ac-edit"
                            disabled={updatingId !== null}
                            onClick={() =>
                              setEditor({
                                mode: "edit",
                                employee,
                              })
                            }
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="ac-delete"
                            disabled={updatingId !== null}
                            onClick={() =>
                              handleDelete(employee)
                            }
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="ac-table-footer">
            <span>
              Showing {filteredEmployees.length} of{" "}
              {employees.length} employees
            </span>
          </footer>
        </section>
      </main>

      {editor && (
        <EmployeeEditor
          key={
            editor.mode === "edit"
              ? editor.employee.id
              : "new-employee"
          }
          employee={editor.employee || null}
          onClose={() => setEditor(null)}
          onSaved={saved}
        />
      )}
    </div>
  );
}
