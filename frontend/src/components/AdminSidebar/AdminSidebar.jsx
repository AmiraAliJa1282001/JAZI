import { NavLink, useNavigate } from "react-router-dom";

import {
  ClipboardList,
  History,
  LogOut,
  Settings,
  ShoppingBag,
  UserRound,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";

import "./AdminSidebar.css";

import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";


function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
      if (loggingOut) return;

      setLoggingOut(true);
      setLogoutError("");

      try {
        await logout();
        navigate("/employee/login", {
          replace: true,
        });
      } catch (error) {
        setLogoutError(
          error.message || "Failed to log out."
        );
      } finally {
        setLoggingOut(false);
      }
   }

  return (
    <aside className="admin-sidebar">

      {/* =========================
          BRAND
          ========================= */}

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-mark">
          J
        </div>

        <h1>JAZI</h1>

        <span>ADMIN PANEL</span>
      </div>


      {/* =========================
          NAVIGATION
          ========================= */}

      <nav
        className="admin-sidebar-nav"
        aria-label="Admin navigation"
      >

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <ClipboardList
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <ShoppingBag
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Orders</span>
        </NavLink>


        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <UtensilsCrossed
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Products</span>
        </NavLink>


        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <History
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Categories</span>
        </NavLink>


        <NavLink
          to="/admin/employees"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <UsersRound
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Employees</span>
        </NavLink>


        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <Settings
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Settings</span>
        </NavLink>


        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">
            <ClipboardList
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span>Reports</span>
        </NavLink>

      </nav>


      {/* =========================
          BOTTOM
          ========================= */}

      <div className="admin-sidebar-bottom">

        <div className="admin-sidebar-user">

          <div className="admin-sidebar-avatar">
            <UserRound
              size={21}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>


        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut size={20} strokeWidth={1.7} />
          <span>
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {logoutError && (
          <p role="alert" className="admin-sidebar-logout-error">
            {logoutError}
          </p>
        )}

      </div>

    </aside>
  );
}


export default AdminSidebar;