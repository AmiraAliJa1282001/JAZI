
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import {
  getAdminOrders,
  getAdminOrderDetail,
  updateAdminOrderStatus,
} from "../../services/websiteApi";

import "./AdminOrders.css";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} AED`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(date);
};

function StatusBadge({ status }) {
  return (
    <span className={`admin-orders-status status-${status}`}>
      {STATUS_OPTIONS.find((item) => item.value === status)?.label ||
        status}
    </span>
  );
}

const NEXT_ACTION = {
  pending: { status: "confirmed", label: "Confirm Order" },
  confirmed: { status: "preparing", label: "Start Preparing" },
  preparing: { status: "ready", label: "Mark as Ready" },
  ready: { status: "completed", label: "Complete Order" },
};

function OrderDetails({ orderNumber, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [success, setSuccess] = useState("");

  async function confirmStatusChange() {
    if (!pendingAction || saving || !order) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateAdminOrderStatus(orderNumber, pendingAction.status);
      const updated = await getAdminOrderDetail(orderNumber);
      setOrder(updated);
      setPendingAction(null);
      setSuccess("Order status updated successfully.");
      onUpdated();
    } catch (err) {
      setError(err.message || "Could not update order status.");
      // A concurrent update may have changed the available transitions.
      try {
        const latest = await getAdminOrderDetail(orderNumber);
        setOrder(latest);
      } catch {
        // Keep the existing details visible if refreshing fails.
      }
      setPendingAction(null);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    getAdminOrderDetail(orderNumber, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setOrder(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [orderNumber]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        if (pendingAction) setPendingAction(null);
        else onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pendingAction, saving]);

  return (
    <div className="admin-order-overlay" onMouseDown={() => { if (!saving && !pendingAction) onClose(); }}>
      <aside
        className="admin-order-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${orderNumber} details`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="admin-order-drawer-header">
          <div>
            <span className="admin-orders-eyebrow">ORDER DETAILS</span>
            <h2>{orderNumber}</h2>
          </div>
          <button
            type="button"
            className="admin-orders-icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close order details"
          >
            <X size={20} />
          </button>
        </header>

        {loading ? (
          <div className="admin-orders-empty">Loading order details...</div>
        ) : error ? (
          <div className="admin-orders-error" role="alert">{error}</div>
        ) : order ? (
          <div className="admin-order-drawer-body">
            <div className="admin-order-detail-status">
              <StatusBadge status={order.status} />
              <span>{formatDate(order.created_at)}</span>
            </div>

            <section className="admin-order-detail-section">
              <h3>Customer Information</h3>
              <div className="admin-order-detail-row">
                <span>Name</span>
                <strong>{order.customer_name || "—"}</strong>
              </div>
              <div className="admin-order-detail-row">
                <span>Phone</span>
                <strong>{order.phone || "—"}</strong>
              </div>
            </section>

            <section className="admin-order-detail-section">
              <h3>Ordered Items</h3>
              {(order.items || []).map((item, index) => (
                <div
                  className="admin-order-item"
                  key={item.id ?? index}
                >
                  <div>
                    <strong>
                      {item.product_name || item.name || "Product"}
                    </strong>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                  <strong>
                    {formatMoney(
                      item.line_total ??
                      Number(item.unit_price || 0) *
                        Number(item.quantity || 0)
                    )}
                  </strong>
                </div>
              ))}
            </section>

            {order.note && (
              <section className="admin-order-detail-section">
                <h3>Customer Note</h3>
                <p className="admin-order-note">{order.note}</p>
              </section>
            )}

            <div className="admin-order-detail-total">
              <span>Order Total</span>
              <strong>{formatMoney(order.total)}</strong>
            </div>

            <section className="admin-order-actions" aria-label="Manage order status">
              <h3>Manage Order Status</h3>
              {success && <p className="admin-order-success" role="status">{success}</p>}
              {error && <p className="admin-orders-error" role="alert">{error}</p>}
              {NEXT_ACTION[order.status] ? (
                <div className="admin-order-actions-buttons">
                  <button
                    type="button"
                    className="admin-order-primary-action"
                    disabled={saving}
                    onClick={() => setPendingAction(NEXT_ACTION[order.status])}
                  >
                    {NEXT_ACTION[order.status].label}
                  </button>
                  {["pending", "confirmed"].includes(order.status) && (
                    <button
                      type="button"
                      className="admin-order-cancel-action"
                      disabled={saving}
                      onClick={() => setPendingAction({ status: "cancelled", label: "Cancel Order" })}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ) : (
                <p className="admin-order-final-status">
                  This order is {order.status}. No further status changes are available.
                </p>
              )}
            </section>

            {pendingAction && (
              <div className="admin-order-confirm-backdrop">
                <div className="admin-order-confirm" role="alertdialog" aria-modal="true"
                  aria-labelledby="admin-order-confirm-title"
                  aria-describedby="admin-order-confirm-description">
                  <h3 id="admin-order-confirm-title">Confirm status change</h3>
                  <p id="admin-order-confirm-description">
                    Change order {orderNumber} from {order.status} to {pendingAction.status}?
                  </p>
                  <div className="admin-order-confirm-buttons">
                    <button type="button" disabled={saving} onClick={() => setPendingAction(null)}>
                      Go Back
                    </button>
                    <button type="button" disabled={saving} onClick={confirmStatusChange}>
                      {saving ? "Saving..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function AdminOrders() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const data = await getAdminOrders(
          {
            search,
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
            page,
            page_size: pageSize,
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setOrders(data.results || []);
          setCount(data.count || 0);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setOrders([]);
          setCount(0);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, [search, statusFilter, dateFrom, dateTo, page, refreshKey]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  return (
    <div className="admin-orders-page">
      <AdminSidebar />

      <main className="admin-orders-main">
        <header className="admin-orders-heading">
          <div>
            <span className="admin-orders-eyebrow">JAZI ADMIN PANEL</span>
            <h1>Orders Management</h1>
            <p>View, search and manage restaurant orders.</p>
          </div>

          <button
            type="button"
            className="admin-orders-refresh"
            onClick={() => setRefreshKey((value) => value + 1)}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="admin-orders-panel">
          <div className="admin-orders-panel-heading">
            <div>
              <span className="admin-orders-eyebrow">ORDER RECORDS</span>
              <h2>All Orders</h2>
              <p>{count} orders found</p>
            </div>
            <ShoppingBag size={25} strokeWidth={1.5} />
          </div>

          <div className="admin-orders-filters">
            <form
              className="admin-orders-search"
              onSubmit={handleSearch}
            >
              <Search size={17} />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search order, customer or phone..."
                aria-label="Search orders"
              />
              <button type="submit">Search</button>
            </form>

            <div className="admin-orders-filter-row">
              <Filter size={17} />

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label>
                From
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setPage(1);
                  }}
                />
              </label>

              <label>
                To
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setPage(1);
                  }}
                />
              </label>

              <button
                type="button"
                className="admin-orders-clear"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-orders-error" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="admin-orders-empty" role="status">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-orders-empty">
              <ShoppingBag size={35} strokeWidth={1.4} />
              <strong>No orders found</strong>
              <span>Try adjusting your search or filters.</span>
            </div>
          ) : (
            <div className="admin-orders-table-wrap">
              <table className="admin-orders-management-table">
                <thead>
                  <tr>
                    <th>ORDER NUMBER</th>
                    <th>CUSTOMER</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_number}>
                      <td className="admin-orders-number">
                        {order.order_number}
                      </td>
                      <td>
                        <strong>{order.customer_name}</strong>
                        <span>{order.phone}</span>
                      </td>
                      <td className="admin-orders-amount">
                        {formatMoney(order.total)}
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-orders-view"
                          onClick={() =>
                            setSelectedOrder(order.order_number)
                          }
                        >
                          View details
                          <ChevronRight size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="admin-orders-pagination">
            <span>
              Page {page} of {totalPages} · {count} orders
            </span>

            <div>
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((value) => value - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((value) => value + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </section>
      </main>

      {selectedOrder && (
        <OrderDetails
          orderNumber={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={() => setRefreshKey((value) => value + 1)}
        />
      )}
    </div>
  );
}

export default AdminOrders;
