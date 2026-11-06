import {
  ChevronDown,
  ClipboardList,
  History,
  LogOut,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


function EmployeeSidebar({
  employee,
  activePage = "orders",
  loggingOut = false,
  onLogout,
}) {
  const navigate = useNavigate();
  const [mobileUserOpen, setMobileUserOpen] = useState(false);

  const employeeName = employee
  ? (
      [
        employee?.first_name,
        employee?.last_name,
      ]
        .filter(Boolean)
        .join(" ") ||
      employee?.username ||
      "Employee"
    )
  : "";

  const employeeInitials =
    employeeName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .join("");


  return (
    <aside className="employee-sidebar">

      {/* BRAND */}
      <div className="employee-brand">
        <strong>JAZI</strong>
        <span>EMPLOYEE</span>
      </div>
                {/* MOBILE USER */}
            <div className="employee-mobile-user">
            <button
                type="button"
                className="employee-mobile-user-trigger"
                onClick={() =>
                setMobileUserOpen((current) => !current)
                }
                aria-expanded={mobileUserOpen}
                aria-label="Employee account"
            >
                <span className="employee-mobile-avatar">
                {employee ? employeeInitials : ""}
                </span>

                <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={mobileUserOpen ? "open" : ""}
                />
            </button>

            {mobileUserOpen && (
                <>
                <button
                    type="button"
                    className="employee-mobile-user-backdrop"
                    onClick={() => setMobileUserOpen(false)}
                    aria-label="Close account menu"
                />

                <div className="employee-mobile-user-menu">
                    <div className="employee-mobile-user-details">
                    <div className="employee-mobile-user-icon">
                        <UserRound size={17} strokeWidth={1.8} />
                    </div>

                    <div>
                        <strong>{employeeName}</strong>
                        <span>Employee</span>
                    </div>
                    </div>

                    <button
                    type="button"
                    className="employee-mobile-logout"
                    onClick={onLogout}
                    disabled={loggingOut}
                    >
                    <LogOut size={16} strokeWidth={1.8} />

                    <span>
                        {loggingOut ? "Signing out..." : "Sign Out"}
                    </span>
                    </button>
                </div>
                </>
            )}
            </div>


      {/* NAVIGATION */}
      <nav className="employee-nav">

        <button
          type="button"
          className={
            activePage === "orders"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/employee/orders")
          }
        >
          <ClipboardList
            size={18}
            strokeWidth={1.8}
          />

          <span>Orders</span>
        </button>


        <button
          type="button"
          className={
            activePage === "menu"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/employee/menu")
          }
        >
          <UtensilsCrossed
            size={18}
            strokeWidth={1.8}
          />

          <span>Menu</span>
        </button>


        <button
            type="button"
            className={activePage === "history" ? "active" : ""}
            onClick={() => navigate("/employee/history")}
            >
            <History size={18} strokeWidth={1.8} />
            <span>History</span>
        </button>

      </nav>


      {/* SIDEBAR BOTTOM */}
      <div className="employee-sidebar-bottom">

        <div className="employee-live">
          <i />
          RESTAURANT OPEN
        </div>


        <div className="employee-user">

          <div className="employee-avatar">
            {employee ? employeeInitials : ""}
          </div>


          <div className="employee-user-info">
            <strong>
              {employeeName}
            </strong>

            <span>
              Employee
            </span>
          </div>


          <button
            type="button"
            className="employee-logout"
            onClick={onLogout}
            disabled={loggingOut}
            title="Sign Out"
            aria-label="Sign Out"
          >
            {loggingOut ? (
              "..."
            ) : (
              <LogOut
                size={16}
                strokeWidth={1.8}
              />
            )}
          </button>

        </div>

      </div>

    </aside>
  );
}


export default EmployeeSidebar;