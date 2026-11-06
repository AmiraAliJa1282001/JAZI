
import { useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./AdminCharts.css";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

function OrdersSalesChart({ data = [], loading = false }) {
  const [metric, setMetric] = useState("orders");

  const chartData = data.map((item) => ({
    date: item.date,
    label: formatDate(item.date),
    orders: Number(item.orders) || 0,
    sales: Number(item.sales) || 0,
  }));

  const hasData = chartData.some(
    (item) => item.orders > 0 || item.sales > 0
  );

  const isSales = metric === "sales";

  return (
    <section className="admin-chart-card">
      <div className="admin-chart-header">
        <div>
          <span className="admin-chart-eyebrow">
            PERFORMANCE
          </span>
          <h2>Orders &amp; Sales</h2>
          <p>Restaurant activity over the selected period</p>
        </div>

        <div className="admin-chart-switch">
          <button
            type="button"
            className={!isSales ? "active" : ""}
            onClick={() => setMetric("orders")}
            aria-pressed={!isSales}
          >
            Orders
          </button>

          <button
            type="button"
            className={isSales ? "active" : ""}
            onClick={() => setMetric("sales")}
            aria-pressed={isSales}
          >
            Sales
          </button>
        </div>
      </div>

      <div className="admin-chart-content">
        {loading ? (
          <div className="admin-chart-empty" role="status">
            Loading chart...
          </div>
        ) : !hasData ? (
          <div className="admin-chart-empty">
            <strong>No activity yet</strong>
            <span>
              Orders and sales will appear here.
            </span>
          </div>
        ) : (
          <div className="admin-chart-graph">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 15,
                  right: 12,
                  left: -16,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="jaziOrdersSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#850f1b"
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="95%"
                      stopColor="#850f1b"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#eadfd2"
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#97857a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={15}
                />

                <YAxis
                  tick={{ fill: "#97857a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={isSales}
                  width={48}
                />

                <Tooltip
                  contentStyle={{
                    background: "#fffaf3",
                    border: "1px solid #e8d8c3",
                    borderRadius: "10px",
                    color: "#4b090c",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    isSales
                      ? `${Number(value).toFixed(2)} AED`
                      : value,
                    isSales ? "Sales" : "Orders",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="#850f1b"
                  strokeWidth={2.5}
                  fill="url(#jaziOrdersSalesGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#850f1b",
                    stroke: "#fffaf3",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrdersSalesChart;
