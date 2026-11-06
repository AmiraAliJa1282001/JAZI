import {
  CheckCircle2,
  Search,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import EmployeeSidebar from "../../components/EmployeeSidebar/EmployeeSidebar";

import {
  getEmployeeOrderHistory,
  
} from "../../services/websiteApi";

import "./EmployeeHistory.css";
import { useEmployee } from "../../context/EmployeeContext";

function EmployeeHistory() {
  const navigate = useNavigate();
  const {employee,employeeLoading,loggingOut,logoutEmployee,} = useEmployee();

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);

  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState("");



  async function loadHistory() {
    try {
      setError("");

      const data = await getEmployeeOrderHistory();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load order history:", error);

      if (
        error?.detail ===
          "Authentication credentials were not provided." ||
        error?.detail === "Employee access is required."
      ) {
        navigate("/employee/login", { replace: true });
        return;
      }

      setError(
        error?.detail || "Unable to load order history."
      );
    } finally {
      setLoading(false);
    }
  }

 async function handleLogout() {
  try {
    setError("");

    await logoutEmployee();

    navigate("/employee/login", {
      replace: true,
    });
  } catch (error) {
    console.error(
      "Employee logout failed:",
      error
    );

    setError(
      error?.detail || "Unable to sign out."
    );
  }
}

useEffect(() => {
  if (employeeLoading) return;

  if (!employee) {
    navigate("/employee/login", {
      replace: true,
    });

    return;
  }

  loadHistory();
}, [employeeLoading, employee]);

  const counts = useMemo(() => {
    const completed = orders.filter(
      (order) => order.status === "completed"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    const revenue = orders
      .filter((order) => order.status === "completed")
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

    return {
      total: orders.length,
      completed,
      cancelled,
      revenue,
    };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeStatus === "all" ||
        order.status === activeStatus;

      const searchableText = [
        order.order_number,
        order.customer_name,
        order.phone,
      ]
        .map((value) =>
          String(value || "").toLowerCase()
        )
        .join(" ");

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, activeStatus]);

  const selectedOrder = useMemo(
    () =>
      orders.find(
        (order) =>
          order.order_number === selectedOrderNumber
      ) || null,
    [orders, selectedOrderNumber]
  );

  function formatDate(dateValue) {
    if (!dateValue) return "—";

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateValue));
  }

  function formatTime(dateValue) {
    if (!dateValue) return "—";

    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateValue));
  }

  return (
    <main className="employee-page employee-history-page">
      <EmployeeSidebar
        employee={employee}
        activePage="history"
        loggingOut={loggingOut}
        onLogout={handleLogout}
      />

      <section className="employee-content">
        <header className="employee-header">
          <div>
            <span className="employee-eyebrow">
              ORDER HISTORY
            </span>

            <h1>Past Orders</h1>

            <p>
              View completed and cancelled orders.
            </p>
          </div>
        </header>

        <section className="history-stats">
          <article>
            <span>Total Orders</span>
            <strong>{counts.total}</strong>
          </article>

          <article className="completed">
            <span>Completed</span>
            <strong>{counts.completed}</strong>
          </article>

          <article className="cancelled">
            <span>Cancelled</span>
            <strong>{counts.cancelled}</strong>
          </article>

          <article className="revenue">
            <span>Total Revenue</span>
            <strong>
              {counts.revenue.toFixed(0)}
              <small>AED</small>
            </strong>
          </article>
        </section>

        <section className="history-toolbar">
          <div className="history-status-filters">
            <button
              type="button"
              className={
                activeStatus === "all"
                  ? "active"
                  : ""
              }
              onClick={() => setActiveStatus("all")}
            >
              All
            </button>

            <button
              type="button"
              className={
                activeStatus === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveStatus("completed")
              }
            >
              <CheckCircle2 size={14} />
              Completed
            </button>

            <button
              type="button"
              className={
                activeStatus === "cancelled"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveStatus("cancelled")
              }
            >
              <XCircle size={14} />
              Cancelled
            </button>
          </div>

          <label className="employee-search">
            <Search size={16} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order, customer or phone..."
            />
          </label>
        </section>

        {error && (
          <div className="employee-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="employee-state">
            Loading order history...
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="employee-state">
            <strong>No past orders found</strong>
            <span>
              Completed and cancelled orders will
              appear here.
            </span>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.order_number}>
                    <td>
                      <strong>
                        {order.order_number}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {formatDate(order.updated_at)}
                      </strong>
                      <span>
                        {formatTime(order.updated_at)}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {order.customer_name}
                      </strong>
                      <span>{order.phone}</span>
                    </td>

                    <td>
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1
                        ? "item"
                        : "items"}
                    </td>

                    <td>
                      <strong>
                        {Number(order.total).toFixed(0)} AED
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`history-status ${order.status}`}
                      >
                        {order.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="history-view-button"
                        onClick={() =>
                          setSelectedOrderNumber(
                            order.order_number
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <>
          <button
            type="button"
            className="history-details-backdrop"
            aria-label="Close order details"
            onClick={() =>
              setSelectedOrderNumber(null)
            }
          />

          <aside className="history-details">
            <div className="history-details-header">
              <div>
                <span>ORDER DETAILS</span>
                <h2>
                  {selectedOrder.order_number}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrderNumber(null)
                }
              >
                ×
              </button>
            </div>

            <span
              className={`history-status ${selectedOrder.status}`}
            >
              {selectedOrder.status === "completed"
                ? "Completed"
                : "Cancelled"}
            </span>

            <section className="history-details-section">
              <span>Customer</span>
              <strong>
                {selectedOrder.customer_name}
              </strong>
              <p>{selectedOrder.phone}</p>
            </section>

            <section className="history-details-section">
              <span>Items</span>

              <div className="history-details-items">
                {selectedOrder.items?.map((item) => (
                  <div
                    className="history-details-item"
                    key={item.id}
                  >
                    <div className="history-details-item-main">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product_name}
                        />
                      ) : (
                        <div className="history-item-placeholder">
                          {item.product_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <strong>
                          {item.product_name}
                        </strong>
                        <span>
                          {item.quantity} ×{" "}
                          {Number(
                            item.unit_price
                          ).toFixed(0)}{" "}
                          AED
                        </span>
                      </div>
                    </div>

                    <strong>
                      {Number(
                        item.line_total
                      ).toFixed(0)}{" "}
                      AED
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            {selectedOrder.note && (
              <section className="history-details-section">
                <span>Customer Note</span>
                <p>{selectedOrder.note}</p>
              </section>
            )}

            <div className="history-details-total">
              <span>Total</span>
              <strong>
                {Number(
                  selectedOrder.total
                ).toFixed(0)}{" "}
                AED
              </strong>
            </div>

            <button
              type="button"
              className="history-close-button"
              onClick={() =>
                setSelectedOrderNumber(null)
              }
            >
              Close
            </button>
          </aside>
        </>
      )}
    </main>
  );
}

export default EmployeeHistory;