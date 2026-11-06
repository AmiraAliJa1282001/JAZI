
import "./AdminCharts.css";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  }).format(date);
}

function RecentOrders({ orders = [], loading = false }) {
  return (
    <section className="admin-chart-card admin-orders-card">
      <div className="admin-chart-header">
        <div>
          <span className="admin-chart-eyebrow">
            LATEST ACTIVITY
          </span>
          <h2>Recent Orders</h2>
          <p>Latest orders in the selected period</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-chart-empty" role="status">
          Loading recent orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-chart-empty">
          <strong>No orders yet</strong>
          <span>New orders will appear here.</span>
        </div>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.order_number}>
                  <td className="admin-order-number">
                    {order.order_number}
                  </td>

                  <td>{order.customer_name || "—"}</td>

                  <td className="admin-order-amount">
                    {Number(order.total || 0).toFixed(2)}
                    <span> AED</span>
                  </td>

                  <td>
                    <span
                      className={`admin-order-status status-${order.status}`}
                    >
                      {STATUS_LABELS[order.status] ||
                        order.status}
                    </span>
                  </td>

                  <td className="admin-order-date">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentOrders;
