
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import "./AdminCharts.css";

const STATUS_CONFIG = [
  { key: "pending", label: "Pending", color: "#b4544e" },
  { key: "confirmed", label: "Confirmed", color: "#d6a548" },
  { key: "preparing", label: "Preparing", color: "#6486ad" },
  { key: "ready", label: "Ready", color: "#5b9c75" },
  { key: "completed", label: "Completed", color: "#8e8580" },
  { key: "cancelled", label: "Cancelled", color: "#56373b" },
];

function OrderStatusChart({
  statusCounts = {},
  loading = false,
}) {
  const chartData = STATUS_CONFIG.map((status) => ({
    ...status,
    value: Number(statusCounts[status.key]) || 0,
  }));

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="admin-chart-card">
      <div className="admin-chart-header">
        <div>
          <span className="admin-chart-eyebrow">
            ORDER OVERVIEW
          </span>
          <h2>Order Status</h2>
          <p>Current status of orders in this period</p>
        </div>
      </div>

      <div className="admin-status-chart-content">
        {loading ? (
          <div className="admin-chart-empty" role="status">
            Loading order statuses...
          </div>
        ) : total === 0 ? (
          <div className="admin-chart-empty">
            <strong>No orders yet</strong>
            <span>
              Order status distribution will appear here.
            </span>
          </div>
        ) : (
          <>
            <div className="admin-donut-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.filter(
                      (item) => item.value > 0
                    )}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius="68%"
                    outerRadius="88%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {chartData
                      .filter((item) => item.value > 0)
                      .map((item) => (
                        <Cell
                          key={item.key}
                          fill={item.color}
                        />
                      ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="admin-donut-center">
                <strong>{total}</strong>
                <span>TOTAL ORDERS</span>
              </div>
            </div>

            <div className="admin-status-legend">
              {chartData.map((item) => (
                <div
                  className="admin-status-legend-item"
                  key={item.key}
                >
                  <span
                    className="admin-status-dot"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <span className="admin-status-name">
                    {item.label}
                  </span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default OrderStatusChart;
