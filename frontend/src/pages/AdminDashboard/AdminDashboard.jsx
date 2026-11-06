
import { useEffect, useState } from "react";

import {
  CalendarDays,
  ShoppingBag,
  Coins,
  Users,
  Star,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

import { getAdminAnalytics } from "../../services/websiteApi";

import OrdersSalesChart from "../../components/AdminCharts/OrdersSalesChart";
import OrderStatusChart from "../../components/AdminCharts/OrderStatusChart";
import RecentOrders from "../../components/AdminCharts/RecentOrders";
import BestSellingItems from "../../components/AdminCharts/BestSellingItems";

import "./AdminDashboard.css";


function AdminDashboard() {
  const [period, setPeriod] = useState("today");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setLoading(true);
      setError("");
      setAnalytics(null);

      try {
        const data = await getAdminAnalytics(
          period,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setAnalytics(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message ||
            "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, [period]);

  const summary = analytics?.summary;

  const stats = [
    {
      id: "orders",
      label: "Total Orders",
      value: summary
        ? summary.total_orders.toLocaleString("en-AE")
        : "—",
      description: "Orders in selected period",
      Icon: ShoppingBag,
    },
    {
      id: "sales",
      label: "Total Sales",
      value: summary
        ? Number(summary.total_sales).toLocaleString(
            "en-AE",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        : "—",
      description: "AED · Excludes cancelled orders",
      Icon: Coins,
    },
    {
      id: "customers",
      label: "Customers",
      value: summary
        ? summary.unique_customers.toLocaleString(
            "en-AE"
          )
        : "—",
      description: "Unique customer phone numbers",
      Icon: Users,
    },
    {
      id: "popular",
      label: "Popular Item",
      value: summary
        ? summary.popular_item || "No sales yet"
        : "—",
      description: "Best-selling product",
      Icon: Star,
    },
  ];

  const today = new Intl.DateTimeFormat("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(new Date());

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="admin-dashboard-main">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-heading">
            <span className="admin-dashboard-eyebrow">
              JAZI ADMIN PANEL
            </span>

            <h1>Dashboard</h1>

            <p>
              Here&apos;s what&apos;s happening at JAZI.
            </p>
          </div>

          <div className="admin-dashboard-header-actions">
            <div className="admin-dashboard-date">
              <CalendarDays
                size={17}
                aria-hidden="true"
              />
              <span>{today}</span>
            </div>

            <div className="admin-dashboard-period">
              <select
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value)
                }
                aria-label="Statistics period"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
              </select>

              <ChevronDown
                size={16}
                aria-hidden="true"
              />
            </div>
          </div>
        </header>

        {error && (
          <div
            className="admin-dashboard-error"
            role="alert"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setPeriod((value) => value)}
              disabled
            >
              Please refresh the page
            </button>
          </div>
        )}

        <section
          className="admin-dashboard-stats"
          aria-label="Restaurant statistics"
          aria-busy={loading}
        >
          {stats.map(
            ({
              id,
              label,
              value,
              description,
              Icon,
            }) => (
              <article
                className={`admin-stat-card admin-stat-card-${id}`}
                key={id}
              >
                <div className="admin-stat-card-top">
                  <span className="admin-stat-icon">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </span>

                  {loading && (
                    <RefreshCw
                      size={15}
                      className="admin-stat-loading"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="admin-stat-card-body">
                  <h2>{label}</h2>

                  <strong className="admin-stat-value">
                    {value}
                  </strong>

                  <p>{description}</p>
                </div>
              </article>
            )
          )}
        </section>

        <section className="admin-dashboard-charts" aria-label="Restaurant analytics">
            <OrdersSalesChart data={analytics?.chart || []} loading={loading}/>

            <OrderStatusChart statusCounts={analytics?.status_counts || {}} loading={loading} />
        </section>
        <section  className="admin-dashboard-details"  aria-label="Recent orders and best selling items"  >
          <RecentOrders orders={analytics?.recent_orders || []}  loading={loading} />

          <BestSellingItems items={analytics?.best_sellers || []}  loading={loading} />
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
