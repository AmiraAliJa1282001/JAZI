import {
  AlertTriangle,
  Banknote,
  Check,
  ChefHat,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
 
  X,
  Clock3,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useEmployee } from "../../context/EmployeeContext";

import {
  getEmployeeOrders,
  updateEmployeeOrderStatus,
} from "../../services/websiteApi";

import "./EmployeeOrders.css";
import EmployeeSidebar from "../../components/EmployeeSidebar/EmployeeSidebar";


const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];


const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};


const NEXT_STATUS = {
  pending: {
    status: "confirmed",
    label: "Confirm",
  },

  confirmed: {
    status: "preparing",
    label: "Start Preparing",
  },

  preparing: {
    status: "ready",
    label: "Mark Ready",
  },

  ready: {
    status: "completed",
    label: "Mark Collected",
  },
};


const ORDER_STEPS = [
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: Check,
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
  },
  {
    key: "ready",
    label: "Ready",
    icon: PackageCheck,
  },
  {
    key: "completed",
    label: "Completed",
    icon: CircleCheck,
  },
];


const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  ready: 3,
  completed: 4,
};


function getRelativeTime(dateValue) {
  if (!dateValue) return "";

  const created = new Date(dateValue);
  const now = new Date();

  const difference = Math.max(
    0,
    Math.floor((now - created) / 60000)
  );

  if (difference < 1) {
    return "Just now";
  }

  if (difference === 1) {
    return "1 min ago";
  }

  if (difference < 60) {
    return `${difference} min ago`;
  }

  const hours = Math.floor(
    difference / 60
  );

  if (hours === 1) {
    return "1 hr ago";
  }

  return `${hours} hrs ago`;
}


function EmployeeOrders() {
  const navigate = useNavigate();
  const {employee,employeeLoading,loggingOut,logoutEmployee,} = useEmployee();

  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef(null);
  async function enableSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = audioContextRef.current || new Ctx();
    audioContextRef.current = ctx;
    await ctx.resume();
    setSoundEnabled(true);
  }
  function playOrderSound() {
    const ctx = audioContextRef.current;
    if (!ctx || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + 0.32);
  }
 

  const [activeFilter, setActiveFilter] =useState("all");

  const [search, setSearch] = useState("");

  const [loading, setLoading] =useState(true);

  const [refreshing, setRefreshing] =useState(false);

  const [error, setError] = useState("");

  const [
    updatingOrder,
    setUpdatingOrder,
  ] = useState(null);

  const [
    selectedOrderNumber,
    setSelectedOrderNumber,
  ] = useState(null);

  const [
    newOrderAlert,
    setNewOrderAlert,
  ] = useState(null);

  const [
    pendingStatusChange,
    setPendingStatusChange,
  ] = useState(null);

  const knownOrdersRef =
    useRef(new Set());

  const firstLoadRef =
    useRef(true);


  /* =====================================
     AUTH / SESSION
  ===================================== */

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


  /* =====================================
     LOAD ORDERS
  ===================================== */

  async function loadOrders(
    showRefresh = false
  ) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      }

      const data =
        await getEmployeeOrders();

      if (firstLoadRef.current) {
        knownOrdersRef.current =
          new Set(
            data.map(
              (order) =>
                order.order_number
            )
          );

        firstLoadRef.current = false;
      } else {
        const newOrders =
          data.filter(
            (order) =>
              !knownOrdersRef.current.has(
                order.order_number
              )
          );

        if (newOrders.length > 0) {
          if (audioContextRef.current?.state === "running") {
            fetch("http://127.0.0.1:8000/api/website/order-availability/")
              .then(r => r.json())
              .then(info => { if (info.order_sound_enabled) playOrderSound(); })
              .catch(() => {});
          }
          const newestOrder =
            newOrders[0];

          setNewOrderAlert({
            orderNumber:
              newestOrder.order_number,

            customerName:
              newestOrder.customer_name,

            total:
              newestOrder.total,
          });
        }

        knownOrdersRef.current =
          new Set(
            data.map(
              (order) =>
                order.order_number
            )
          );
      }

      setOrders(data);
    } catch (error) {
      console.error(
        "Failed to load employee orders:",
        error
      );

      if (
        error?.detail ===
          "Authentication credentials were not provided." ||
        error?.detail ===
          "Employee access is required."
      ) {
        navigate(
          "/employee/login",
          { replace: true }
        );

        return;
      }

      setError(
        error?.detail ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  loadOrders();

  const interval = setInterval(() => {
    loadOrders();
  }, 10000);

  return () => clearInterval(interval);
}, [employeeLoading, employee]);

  /* =====================================
     SELECTED ORDER
  ===================================== */

  const selectedOrder =
    useMemo(() => {
      if (!selectedOrderNumber) {
        return null;
      }

      return (
        orders.find(
          (order) =>
            order.order_number ===
            selectedOrderNumber
        ) || null
      );
    }, [
      orders,
      selectedOrderNumber,
    ]);


  /* =====================================
     STATUS CHANGES
  ===================================== */

  function requestStatusChange(
    order,
    newStatus
  ) {
    if (!order) return;

    setPendingStatusChange({
      orderNumber:
        order.order_number,

      currentStatus:
        order.status,

      newStatus,
    });
  }


  function closeStatusConfirmation() {
    if (updatingOrder) return;

    setPendingStatusChange(null);
  }


  async function handleStatusChange(
    orderNumber,
    newStatus
  ) {
    if (updatingOrder) {
      return false;
    }

    try {
      setUpdatingOrder(
        orderNumber
      );

      setError("");

      const updatedOrder =
        await updateEmployeeOrderStatus(
          orderNumber,
          newStatus
        );

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) =>
              order.order_number ===
              orderNumber
                ? updatedOrder
                : order
          )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      if (
        error?.detail ===
          "Authentication credentials were not provided." ||
        error?.detail ===
          "Employee access is required."
      ) {
        navigate(
          "/employee/login",
          { replace: true }
        );

        return false;
      }

      setError(
        error?.detail ||
          "Unable to update order status."
      );

      return false;
    } finally {
      setUpdatingOrder(null);
    }
  }


  async function confirmStatusChange() {
    if (
      !pendingStatusChange ||
      updatingOrder
    ) {
      return;
    }

    const {
      orderNumber,
      newStatus,
    } = pendingStatusChange;

    const success =
      await handleStatusChange(
        orderNumber,
        newStatus
      );

    if (success) {
      setPendingStatusChange(null);
    }
  }


  /* =====================================
     COUNTS
  ===================================== */

  const counts = useMemo(() => {
    return {
      all: orders.length,

      pending: orders.filter(
        (order) =>
          order.status ===
          "pending"
      ).length,

      confirmed: orders.filter(
        (order) =>
          order.status ===
          "confirmed"
      ).length,

      preparing: orders.filter(
        (order) =>
          order.status ===
          "preparing"
      ).length,

      ready: orders.filter(
        (order) =>
          order.status ===
          "ready"
      ).length,

      completed: orders.filter(
        (order) =>
          order.status ===
          "completed"
      ).length,

      cancelled: orders.filter(
        (order) =>
          order.status ===
          "cancelled"
      ).length,
    };
  }, [orders]);


  /* =====================================
     FILTERED ORDERS
  ===================================== */

  const visibleOrders =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesFilter =
            activeFilter === "all" ||
            order.status ===
              activeFilter;

          const orderNumber =
            String(
              order.order_number || ""
            ).toLowerCase();

          const customerName =
            String(
              order.customer_name || ""
            ).toLowerCase();

          const phone =
            String(
              order.phone || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            orderNumber.includes(
              normalizedSearch
            ) ||
            customerName.includes(
              normalizedSearch
            ) ||
            phone.includes(
              normalizedSearch
            );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      orders,
      activeFilter,
      search,
    ]);


  /* =====================================
     HELPERS
  ===================================== */

  function formatOrderTime(
    dateValue
  ) {
    if (!dateValue) return "";

    return new Intl.DateTimeFormat(
      "en-AE",
      {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }
    ).format(
      new Date(dateValue)
    );
  }




  /* =====================================
     RENDER
  ===================================== */

  return (
    <main className="employee-page">
      {/* ==============================
          SIDEBAR
      ============================== */}

      <EmployeeSidebar
        employee={employee}
        activePage="orders"
        loggingOut={loggingOut}
        onLogout={handleLogout}
      />


      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <section className="employee-content">
        <header className="employee-header">
          <div>
            <span className="employee-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage incoming orders
              and keep customers
              updated.
            </p>
          </div>

          <button
            className="employee-refresh"
            type="button"
            onClick={() =>
              loadOrders(true)
            }
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "spinning"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </header>


        {/* NEW ORDER ALERT */}

        <button type="button" onClick={enableSound} style={{margin:"12px 0",padding:"9px 14px",borderRadius:8,border:"1px solid #d3b06b",background:"#fffdf9",cursor:"pointer"}}>{soundEnabled ? "🔔 Order sound enabled" : "🔔 Enable order sound"}</button>
        {newOrderAlert && (
          <div className="employee-new-order-alert">
            <div className="employee-new-order-alert-icon">
              <ClipboardList
                size={18}
              />
            </div>

            <div className="employee-new-order-alert-content">
              <span>
                NEW ORDER RECEIVED
              </span>

              <strong>
                {
                  newOrderAlert.orderNumber
                }
              </strong>

              <small>
                {
                  newOrderAlert.customerName
                }
                {" · "}
                {Number(
                  newOrderAlert.total
                ).toFixed(0)}{" "}
                AED
              </small>
            </div>

            <button
              type="button"
              className="employee-new-order-view"
              onClick={() => {
                setSelectedOrderNumber(
                  newOrderAlert.orderNumber
                );

                setNewOrderAlert(
                  null
                );
              }}
            >
              View Order
              <ChevronRight
                size={14}
              />
            </button>

            <button
              type="button"
              className="employee-new-order-close"
              onClick={() =>
                setNewOrderAlert(
                  null
                )
              }
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}


        {/* ==============================
            STATS
        ============================== */}

        <section className="employee-stats employee-status-summary">
          <article className="summary-card pending">
            <div className="summary-icon">
              <ClipboardList
                size={18}
              />
            </div>

            <div>
              <strong>
                {counts.pending}
              </strong>

              <span>
                New Orders
              </span>
            </div>
          </article>

          <article className="summary-card preparing">
            <div className="summary-icon">
              <ChefHat
                size={18}
              />
            </div>

            <div>
              <strong>
                {counts.preparing}
              </strong>

              <span>
                Preparing
              </span>
            </div>
          </article>

          <article className="summary-card ready">
            <div className="summary-icon">
              <PackageCheck
                size={18}
              />
            </div>

            <div>
              <strong>
                {counts.ready}
              </strong>

              <span>
                Ready
              </span>
            </div>
          </article>

          <article className="summary-card completed">
            <div className="summary-icon">
              <CircleCheck
                size={18}
              />
            </div>

            <div>
              <strong>
                {counts.completed}
              </strong>

              <span>
                Completed
              </span>
            </div>
          </article>
        </section>


        {/* ==============================
            FILTERS / SEARCH
        ============================== */}

        <section className="employee-toolbar">
          <div className="employee-filters">
            {FILTERS.map(
              (filter) => (
                <button
                  type="button"
                  key={
                    filter.key
                  }
                  className={
                    activeFilter ===
                    filter.key
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveFilter(
                      filter.key
                    )
                  }
                >
                  {filter.label}

                  <span>
                    {counts[
                      filter.key
                    ] ?? 0}
                  </span>
                </button>
              )
            )}
          </div>

          <label className="employee-search">
            <Search
              size={16}
              strokeWidth={1.8}
            />

            <input
              type="search"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search order, customer or phone"
            />
          </label>
        </section>


        {error && (
          <div className="employee-error">
            {error}
          </div>
        )}


        {/* ==============================
            ORDERS
        ============================== */}

        {loading ? (
          <div className="employee-state">
            Loading orders...
          </div>
        ) : visibleOrders.length ===
          0 ? (
          <div className="employee-state">
            <strong>
              No orders found
            </strong>

            <span>
              Orders matching this
              filter will appear here.
            </span>
          </div>
        ) : (
          <section className="employee-orders-table">
            <div className="employee-table-head">
              <span>ORDER</span>
              <span>CUSTOMER</span>
              <span>ITEMS</span>
              <span>TOTAL</span>
              <span>STATUS</span>
              <span>TIME</span>
              <span>ACTIONS</span>
            </div>

            <div className="employee-table-body">
              {visibleOrders.map(
                (order) => {
                  const nextAction =
                    NEXT_STATUS[
                      order.status
                    ];

                  return (
                    <article
                      className={`employee-table-order ${order.status} ${
                        selectedOrderNumber ===
                        order.order_number
                          ? "selected"
                          : ""
                      }`}
                      key={order.id}
                      onClick={() =>
                        setSelectedOrderNumber(
                          order.order_number
                        )
                      }
                    >
                      {/* ORDER */}

                      <div className="employee-table-order-number">
                        <strong>
                          {
                            order.order_number
                          }
                        </strong>

                        <small>
                          #{order.id}
                        </small>
                      </div>


                      {/* CUSTOMER */}

                      <div className="employee-table-customer">
                        <strong>
                          {
                            order.customer_name
                          }
                        </strong>

                        <span>
                          {order.phone}
                        </span>
                      </div>


                      {/* ITEMS */}

                      <div className="employee-table-items">
                        <div className="employee-item-thumbnails">
                          {order.items
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                item
                              ) => (
                                <div
                                  className="employee-item-thumbnail"
                                  key={
                                    item.id
                                  }
                                  title={`${item.quantity}× ${item.product_name}`}
                                >
                                  {item.image ? (
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.product_name
                                      }
                                    />
                                  ) : (
                                    <span>
                                      {item.product_name
                                        ?.charAt(
                                          0
                                        )
                                        .toUpperCase()}
                                    </span>
                                  )}

                                  {item.quantity >
                                    1 && (
                                    <small>
                                      ×
                                      {
                                        item.quantity
                                      }
                                    </small>
                                  )}
                                </div>
                              )
                            )}

                          {order.items
                            .length >
                            3 && (
                            <div className="employee-items-more">
                              +
                              {order
                                .items
                                .length -
                                3}
                            </div>
                          )}
                        </div>
                      </div>


                      {/* TOTAL */}

                      <div className="employee-table-total">
                        <strong>
                          {Number(
                            order.total
                          ).toFixed(
                            0
                          )}
                        </strong>

                        <span>
                          AED
                        </span>
                      </div>


                      {/* STATUS */}

                      <div>
                        <span
                          className={`employee-status ${order.status}`}
                        >
                          <i />

                          {
                            STATUS_LABELS[
                              order
                                .status
                            ]
                          }
                        </span>
                      </div>


                      {/* TIME */}

                      <div className="employee-table-time">
                        <strong>
                          {getRelativeTime(
                            order.created_at
                          )}
                        </strong>

                        <small>
                          {formatOrderTime(
                            order.created_at
                          )}
                        </small>
                      </div>


                      {/* ACTIONS */}

                      <div
                        className="employee-table-actions"
                        onClick={(
                          event
                        ) =>
                          event.stopPropagation()
                        }
                      >
                        {nextAction && (
                          <button
                            type="button"
                            className={`employee-quick-action ${order.status}`}
                            disabled={
                              updatingOrder ===
                              order.order_number
                            }
                            onClick={() =>
                              requestStatusChange(
                                order,
                                nextAction.status
                              )
                            }
                          >
                            {updatingOrder ===
                            order.order_number
                              ? "Updating..."
                              : nextAction.label}
                          </button>
                        )}

                        <button
                          type="button"
                          className="employee-order-more"
                          onClick={() =>
                            setSelectedOrderNumber(
                              order.order_number
                            )
                          }
                          aria-label="View order details"
                        >
                          <MoreHorizontal
                            size={
                              17
                            }
                          />
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}
      </section>


      {/* ==============================
          DETAILS OVERLAY
      ============================== */}

      {selectedOrder && (
        <button
          type="button"
          className="employee-details-overlay"
          aria-label="Close order details"
          onClick={() =>
            setSelectedOrderNumber(
              null
            )
          }
        />
      )}


      {/* ==============================
          ORDER DETAILS PANEL
      ============================== */}

      <aside
        className={`employee-details-panel ${
          selectedOrder
            ? "open"
            : ""
        }`}
      >
        {selectedOrder && (
          <>
            <header className="employee-details-header">
              <div>
                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  {
                    selectedOrder.order_number
                  }
                </h2>
              </div>

              <button
                type="button"
                className="employee-details-close"
                onClick={() =>
                  setSelectedOrderNumber(
                    null
                  )
                }
                aria-label="Close order details"
              >
                <X
                  size={18}
                />
              </button>
            </header>


            <div className="employee-details-body">
              {/* STATUS */}

              <div className="employee-details-status">
                <span
                  className={`employee-status ${selectedOrder.status}`}
                >
                  <i />

                  {
                    STATUS_LABELS[
                      selectedOrder
                        .status
                    ]
                  }
                </span>

                <small>
                  {formatOrderTime(
                    selectedOrder.created_at
                  )}
                </small>
              </div>


              {/* TIMELINE */}

              {selectedOrder.status !==
                "cancelled" && (
                <section className="employee-order-progress">
                  {ORDER_STEPS.map(
                    (
                      step,
                      index
                    ) => {
                      const Icon =
                        step.icon;

                      const currentIndex =
                        STATUS_INDEX[
                          selectedOrder
                            .status
                        ] ?? 0;

                      const isCompleted =
                        index <
                        currentIndex;

                      const isCurrent =
                        index ===
                        currentIndex;

                      return (
                        <div
                          className={`employee-progress-step ${
                            isCompleted
                              ? "completed"
                              : ""
                          } ${
                            isCurrent
                              ? `current ${step.key}`
                              : ""
                          }`}
                          key={
                            step.key
                          }
                        >
                          <div className="employee-progress-marker">
                            {isCompleted ? (
                              <Check
                                size={
                                  12
                                }
                              />
                            ) : (
                              <Icon
                                size={
                                  12
                                }
                              />
                            )}
                          </div>

                          <span>
                            {
                              step.label
                            }
                          </span>

                          {index <
                            ORDER_STEPS.length -
                              1 && (
                            <div className="employee-progress-line" />
                          )}
                        </div>
                      );
                    }
                  )}
                </section>
              )}


              {/* CUSTOMER */}

              <section className="employee-details-section">
                <span className="employee-details-label">
                  CUSTOMER
                </span>

                <div className="employee-customer-card">
                  <div className="employee-customer-avatar">
                    {selectedOrder.customer_name
                      ?.charAt(
                        0
                      )
                      .toUpperCase()}
                  </div>

                  <div className="employee-customer-info">
                    <strong>
                      {
                        selectedOrder.customer_name
                      }
                    </strong>

                    <a
                      href={`tel:${selectedOrder.phone}`}
                    >
                      <Phone
                        size={
                          13
                        }
                      />

                      {
                        selectedOrder.phone
                      }
                    </a>
                  </div>
                </div>
              </section>


              {/* ITEMS */}

              <section className="employee-details-section">
                <div className="employee-details-section-heading">
                  <span className="employee-details-label">
                    ORDER ITEMS
                  </span>

                  <small>
                    {
                      selectedOrder
                        .items
                        .length
                    }{" "}
                    {selectedOrder
                      .items
                      .length ===
                    1
                      ? "item"
                      : "items"}
                  </small>
                </div>

                <div className="employee-details-items">
                  {selectedOrder.items.map(
                    (
                      item
                    ) => (
                      <div
                        className="employee-details-item employee-details-item-new"
                        key={
                          item.id
                        }
                      >
                        <div className="employee-details-product-image">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.product_name
                              }
                            />
                          ) : (
                            <span>
                              {item.product_name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase()}
                            </span>
                          )}

                          <small>
                            ×
                            {
                              item.quantity
                            }
                          </small>
                        </div>

                        <div className="employee-details-product-info">
                          <strong>
                            {
                              item.product_name
                            }
                          </strong>

                          <span>
                            {Number(
                              item.unit_price
                            ).toFixed(
                              0
                            )}{" "}
                            AED
                            each
                          </span>
                        </div>

                        <strong className="employee-details-product-price">
                          {Number(
                            item.line_total
                          ).toFixed(
                            0
                          )}

                          <small>
                            AED
                          </small>
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </section>


              {/* NOTE */}

              {selectedOrder.note && (
                <section className="employee-details-section">
                  <span className="employee-details-label">
                    ORDER NOTE
                  </span>

                  <div className="employee-details-note employee-details-note-new">
                    <span>
                      “
                    </span>

                    <p>
                      {
                        selectedOrder.note
                      }
                    </p>
                  </div>
                </section>
              )}


              {/* PICKUP / PAYMENT */}

              <section className="employee-details-section">
                <div className="employee-order-methods">
                  <div className="employee-order-method-card">
                    <div className="employee-method-icon">
                      <MapPin
                        size={
                          16
                        }
                      />
                    </div>

                    <div>
                      <span>
                        PICKUP
                      </span>

                      <strong>
                        JAZI
                        Lobster
                        Cafeteria
                      </strong>
                    </div>
                  </div>

                  <div className="employee-order-method-card">
                    <div className="employee-method-icon">
                      <Banknote
                        size={
                          16
                        }
                      />
                    </div>

                    <div>
                      <span>
                        PAYMENT
                      </span>

                      <strong>
                        Cash on
                        Pickup
                      </strong>
                    </div>
                  </div>
                </div>
              </section>


              {/* TOTAL */}

              <div className="employee-details-total employee-details-total-new">
                <div>
                  <span>
                    TOTAL
                  </span>

                  <small>
                    VAT inclusive
                  </small>
                </div>

                <strong>
                  {Number(
                    selectedOrder.total
                  ).toFixed(
                    0
                  )}

                  <small>
                    AED
                  </small>
                </strong>
              </div>
            </div>


            {/* DETAILS ACTIONS */}

            <footer className="employee-details-actions employee-details-actions-new">
              {selectedOrder.status ===
                "pending" && (
                <>
                  <button
                    type="button"
                    className="employee-action-primary status-confirm"
                    disabled={
                      updatingOrder ===
                      selectedOrder.order_number
                    }
                    onClick={() =>
                      requestStatusChange(
                        selectedOrder,
                        "confirmed"
                      )
                    }
                  >
                    <Check
                      size={
                        16
                      }
                    />

                    Confirm
                    Order
                  </button>

                  <button
                    type="button"
                    className="employee-action-danger"
                    disabled={
                      updatingOrder ===
                      selectedOrder.order_number
                    }
                    onClick={() =>
                      requestStatusChange(
                        selectedOrder,
                        "cancelled"
                      )
                    }
                  >
                    <X
                      size={
                        15
                      }
                    />

                    Cancel
                  </button>
                </>
              )}


              {selectedOrder.status ===
                "confirmed" && (
                <button
                  type="button"
                  className="employee-action-primary status-preparing"
                  disabled={
                    updatingOrder ===
                    selectedOrder.order_number
                  }
                  onClick={() =>
                    requestStatusChange(
                      selectedOrder,
                      "preparing"
                    )
                  }
                >
                  <ChefHat
                    size={
                      16
                    }
                  />

                  Start
                  Preparing
                </button>
              )}


              {selectedOrder.status ===
                "preparing" && (
                <button
                  type="button"
                  className="employee-action-primary status-ready"
                  disabled={
                    updatingOrder ===
                    selectedOrder.order_number
                  }
                  onClick={() =>
                    requestStatusChange(
                      selectedOrder,
                      "ready"
                    )
                  }
                >
                  <PackageCheck
                    size={
                      16
                    }
                  />

                  Mark as
                  Ready
                </button>
              )}


              {selectedOrder.status ===
                "ready" && (
                <button
                  type="button"
                  className="employee-action-success"
                  disabled={
                    updatingOrder ===
                    selectedOrder.order_number
                  }
                  onClick={() =>
                    requestStatusChange(
                      selectedOrder,
                      "completed"
                    )
                  }
                >
                  <CircleCheck
                    size={
                      16
                    }
                  />

                  Mark as
                  Collected
                </button>
              )}


              {selectedOrder.status ===
                "completed" && (
                <div className="employee-details-finished">
                  <CircleCheck
                    size={
                      17
                    }
                  />

                  Order
                  Completed
                </div>
              )}


              {selectedOrder.status ===
                "cancelled" && (
                <div className="employee-details-cancelled">
                  <X
                    size={
                      17
                    }
                  />

                  Order
                  Cancelled
                </div>
              )}
            </footer>
          </>
        )}
      </aside>


      {/* ==============================
          STATUS CONFIRMATION MODAL
      ============================== */}

      {pendingStatusChange && (
        <div
          className="employee-confirm-overlay"
          onMouseDown={
            closeStatusConfirmation
          }
        >
          <div
            className="employee-confirm-modal"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-confirm-title"
          >
            <button
              type="button"
              className="employee-confirm-close"
              onClick={
                closeStatusConfirmation
              }
              aria-label="Close"
            >
              <X
                size={
                  17
                }
              />
            </button>


            <div
              className={`employee-confirm-icon ${pendingStatusChange.newStatus}`}
            >
              {pendingStatusChange.newStatus ===
              "cancelled" ? (
                <AlertTriangle
                  size={
                    23
                  }
                />
              ) : pendingStatusChange.newStatus ===
                "preparing" ? (
                <ChefHat
                  size={
                    23
                  }
                />
              ) : pendingStatusChange.newStatus ===
                "ready" ? (
                <PackageCheck
                  size={
                    23
                  }
                />
              ) : pendingStatusChange.newStatus ===
                "completed" ? (
                <CircleCheck
                  size={
                    23
                  }
                />
              ) : (
                <Check
                  size={
                    23
                  }
                />
              )}
            </div>


            <span className="employee-confirm-eyebrow">
              UPDATE ORDER STATUS
            </span>


            <h3 id="status-confirm-title">
              {pendingStatusChange.newStatus ===
              "cancelled"
                ? "Cancel this order?"
                : `Change status to ${
                    STATUS_LABELS[
                      pendingStatusChange
                        .newStatus
                    ]
                  }?`}
            </h3>


            <p>
              Order{" "}
              <strong>
                {
                  pendingStatusChange.orderNumber
                }
              </strong>{" "}
              will move from{" "}
              <b>
                {
                  STATUS_LABELS[
                    pendingStatusChange
                      .currentStatus
                  ]
                }
              </b>{" "}
              to{" "}
              <b>
                {
                  STATUS_LABELS[
                    pendingStatusChange
                      .newStatus
                  ]
                }
              </b>.
            </p>


            <div className="employee-confirm-transition">
              <span
                className={`employee-status ${pendingStatusChange.currentStatus}`}
              >
                <i />

                {
                  STATUS_LABELS[
                    pendingStatusChange
                      .currentStatus
                  ]
                }
              </span>

              <ChevronRight
                size={
                  16
                }
              />

              <span
                className={`employee-status ${pendingStatusChange.newStatus}`}
              >
                <i />

                {
                  STATUS_LABELS[
                    pendingStatusChange
                      .newStatus
                  ]
                }
              </span>
            </div>


            <div className="employee-confirm-actions">
              <button
                type="button"
                className="employee-confirm-cancel"
                onClick={
                  closeStatusConfirmation
                }
                disabled={Boolean(
                  updatingOrder
                )}
              >
                Go Back
              </button>

              <button
                type="button"
                className={`employee-confirm-submit ${pendingStatusChange.newStatus}`}
                onClick={
                  confirmStatusChange
                }
                disabled={Boolean(
                  updatingOrder
                )}
              >
                {updatingOrder
                  ? "Updating..."
                  : pendingStatusChange.newStatus ===
                    "cancelled"
                  ? "Cancel Order"
                  : "Confirm Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


export default EmployeeOrders;