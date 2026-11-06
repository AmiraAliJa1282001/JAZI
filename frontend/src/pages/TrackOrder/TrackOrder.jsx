import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  ArrowRight,
  Check,
  RefreshCw,
  Utensils,
  X,
  XCircle,
} from "lucide-react";

import { trackOrder } from "../../services/websiteApi";

import "./TrackOrder.css";


const STATUS_STEPS = [
  {
    key: "pending",
    label: "Received",
  },
  {
    key: "confirmed",
    label: "Confirmed",
  },
  {
    key: "preparing",
    label: "Preparing",
  },
  {
    key: "ready",
    label: "Ready",
  },
  {
    key: "completed",
    label: "Completed",
  },
];


const STATUS_CONTENT = {
  pending: {
    eyebrow: "ORDER RECEIVED",
    title: "We’ve Got Your Order",
    description:
      "Your order has been received and is waiting for confirmation.",
  },

  confirmed: {
    eyebrow: "ORDER CONFIRMED",
    title: "Your Order Is Confirmed",
    description:
      "Your order has been confirmed and will be prepared shortly.",
  },

  preparing: {
    eyebrow: "IN THE KITCHEN",
    title: "Preparing Your Order",
    description:
      "Our kitchen is preparing your order. We’ll have it ready for you soon.",
  },

  ready: {
    eyebrow: "READY FOR PICKUP",
    title: "Your Order Is Ready",
    description:
      "Your order is ready. You can now head to JAZI to collect it.",
  },

  completed: {
    eyebrow: "ORDER COMPLETED",
    title: "Order Collected",
    description:
      "Your order has been collected successfully. Thank you for choosing JAZI.",
  },

  cancelled: {
    eyebrow: "ORDER CANCELLED",
    title: "Order Cancelled",
    description:
      "This order has been cancelled.",
  },
};


function TrackOrder() {
  const location = useLocation();

  const passedOrderId =
    location.state?.orderId || "";

  const passedPhone =
    location.state?.phone || "";

  const [orderId, setOrderId] =
    useState(passedOrderId);

  const [phone, setPhone] =
    useState(passedPhone);

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =========================
     LOAD PASSED ORDER
     ========================= */

  useEffect(() => {
    if (!passedOrderId || !passedPhone) {
      return;
    }

    async function loadOrder() {
      setLoading(true);
      setError("");

      try {
        const data = await trackOrder(
          String(passedOrderId),
          passedPhone
        );

        setOrder(data);
      } catch (error) {
        console.error(
          "Track order failed:",
          error
        );

        setError(
          error?.detail ||
            "We couldn't find an order matching these details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [passedOrderId, passedPhone]);


  /* =========================
     MANUAL TRACKING
     ========================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await trackOrder(
        String(orderId).trim(),
        phone.trim()
      );

      setOrder(data);
    } catch (error) {
      console.error(
        "Track order failed:",
        error
      );

      setError(
        error?.detail ||
          "We couldn't find an order matching these details."
      );
    } finally {
      setLoading(false);
    }
  }


  /* =========================
     STATUS
     ========================= */

  const currentStatusIndex = order
    ? STATUS_STEPS.findIndex(
        (step) => step.key === order.status
      )
    : -1;

  const statusContent = order
    ? STATUS_CONTENT[order.status] ||
      STATUS_CONTENT.pending
    : null;

  const isReady =
    order?.status === "ready";

  const isCompleted =
    order?.status === "completed";

  const isSuccess =
    isReady || isCompleted;

  const isCancelled =
    order?.status === "cancelled";


  /* =========================
     STATUS ICON
     ========================= */

  function renderStatusIcon() {
    if (isCancelled) {
      return (
        <X
          size={22}
          strokeWidth={2}
          aria-hidden="true"
        />
      );
    }

    if (order?.status === "preparing") {
      return (
        <Utensils
          size={21}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      );
    }

    return (
      <Check
        size={22}
        strokeWidth={2}
        aria-hidden="true"
      />
    );
  }


  return (
    <main className="track-page">

      <div className="track-container">

        {/* =========================
            HERO
            ========================= */}

        <header className="track-header">

          <span className="track-eyebrow">
            JAZI LOBSTER CAFETERIA
          </span>

          <h1>
            Track Your Order
          </h1>

          <div
            className="track-decoration"
            aria-hidden="true"
          >
            <span />
            <i />
            <span />
          </div>

          <p>
            Enter your order number and phone
            number to see the latest status of
            your order.
          </p>

        </header>


        {/* =========================
            SEARCH
            ========================= */}

        <section className="track-search">

          <form
            className="track-form"
            onSubmit={handleSubmit}
          >

            <label className="track-field">

              <span>
                ORDER NUMBER
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={orderId}
                onChange={(event) =>
                  setOrderId(
                    event.target.value
                  )
                }
                placeholder="e.g. 12"
                required
                disabled={loading}
              />

            </label>


            <label className="track-field">

              <span>
                PHONE NUMBER
              </span>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="+971"
                required
                disabled={loading}
              />

            </label>


            <button
              type="submit"
              className="track-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "TRACKING..."
                  : "TRACK ORDER"}
              </span>

              {loading ? (
                <RefreshCw
                  className="track-loading-icon"
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}

            </button>

          </form>


          {error && (
            <div
              className="track-error"
              role="alert"
            >

              <span
                className="track-error-icon"
                aria-hidden="true"
              >
                <XCircle
                  size={15}
                  strokeWidth={1.8}
                />
              </span>

              <p>
                {error}
              </p>

            </div>
          )}

        </section>


        {/* =========================
            RESULT
            ========================= */}

        {order && (
          <section className="track-result">

            {/* =========================
                ORDER META
                ========================= */}

            <div className="track-order-meta">

              <div>
                <span>ORDER</span>

                <strong>
                  #{order.order_number}
                </strong>
              </div>


              <div
                className="track-meta-divider"
                aria-hidden="true"
              />


              <div>
                <span>TOTAL</span>

                <strong>
                  {Number(
                    order.total
                  ).toFixed(0)}

                  <small>
                    AED
                  </small>
                </strong>
              </div>


              <div
                className="track-meta-divider"
                aria-hidden="true"
              />


              <div>
                <span>METHOD</span>

                <strong>
                  Pickup
                </strong>
              </div>

            </div>


            {/* =========================
                CURRENT STATUS
                ========================= */}

            <div
              className={`track-status-hero ${
                isSuccess
                  ? "success"
                  : ""
              } ${
                isCancelled
                  ? "cancelled"
                  : ""
              }`}
            >

              <div className="track-status-orbit">

                <div
                  className="track-status-icon"
                  aria-hidden="true"
                >
                  {renderStatusIcon()}
                </div>

              </div>


              <span className="track-status-eyebrow">
                {statusContent.eyebrow}
              </span>

              <h2>
                {statusContent.title}
              </h2>

              <p>
                {statusContent.description}
              </p>


              {/* =========================
                  READY MESSAGE
                  ========================= */}

              {isReady && (
                <div className="track-ready-message">

                  <span
                    className="track-ready-dot"
                    aria-hidden="true"
                  />

                  <div>
                    <strong>
                      READY FOR COLLECTION
                    </strong>

                    <p>
                      You can now head to JAZI
                      to collect your order.
                    </p>
                  </div>

                </div>
              )}


              {/* =========================
                  COMPLETED MESSAGE
                  ========================= */}

              {isCompleted && (
                <div className="track-ready-message">

                  <span
                    className="track-ready-check"
                    aria-hidden="true"
                  >
                    <Check
                      size={15}
                      strokeWidth={2}
                    />
                  </span>

                  <div>
                    <strong>
                      ORDER COMPLETED
                    </strong>

                    <p>
                      Your order has been
                      collected successfully.
                    </p>
                  </div>

                </div>
              )}

            </div>


            {/* =========================
                PROGRESS
                ========================= */}

            {!isCancelled && (
              <div className="track-progress">

                {STATUS_STEPS.map(
                  (step, index) => {
                    const completed =
                      index <
                      currentStatusIndex;

                    const active =
                      index ===
                      currentStatusIndex;

                    const reached =
                      index <=
                      currentStatusIndex;

                    return (
                      <div
                        className={`track-progress-step ${
                          completed
                            ? "completed"
                            : ""
                        } ${
                          active
                            ? "active"
                            : ""
                        } ${
                          reached
                            ? "reached"
                            : ""
                        } ${
                          isSuccess &&
                          reached
                            ? "success"
                            : ""
                        }`}
                        key={step.key}
                      >

                        <div className="track-progress-top">

                          <div className="track-progress-circle">

                            {completed ? (
                              <Check
                                size={14}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ) : (
                              index + 1
                            )}

                          </div>


                          {index <
                            STATUS_STEPS.length -
                              1 && (
                            <div
                              className="track-progress-line"
                              aria-hidden="true"
                            />
                          )}

                        </div>


                        <span>
                          {step.label}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>
            )}


            {/* =========================
                BOTTOM GRID
                ========================= */}

            <div className="track-bottom-grid">

              {/* =========================
                  ORDER SUMMARY
                  ========================= */}

              <div className="track-summary">

                <div className="track-section-heading">

                  <span>
                    YOUR ORDER
                  </span>

                  <h3>
                    Order Summary
                  </h3>

                </div>


                <div className="track-items">

                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="track-item"
                        key={
                          item.id ||
                          item.order_number ||
                          `${item.product_name}-${index}`
                        }
                      >

                        <div className="track-item-left">

                          <span className="track-item-quantity">
                            {item.quantity}
                          </span>

                          <div>

                            <strong>
                              {item.product_name}
                            </strong>

                            <small>
                              {Number(
                                item.unit_price
                              ).toFixed(0)}{" "}
                              AED each
                            </small>

                          </div>

                        </div>


                        <strong className="track-item-price">

                          {Number(
                            item.line_total
                          ).toFixed(0)}

                          <small>
                            AED
                          </small>

                        </strong>

                      </div>
                    )
                  )}

                </div>


                <div className="track-total">

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
                      order.total
                    ).toFixed(0)}

                    <small>
                      AED
                    </small>

                  </strong>

                </div>

              </div>


              {/* =========================
                  PICKUP CARD
                  ========================= */}

              <aside
                className={`track-pickup ${
                  isReady
                    ? "ready"
                    : ""
                }`}
              >

                <span className="track-pickup-eyebrow">
                  PICKUP
                </span>

                <h3>
                  JAZI
                </h3>

                <p className="track-pickup-name">
                  Lobster Cafeteria
                </p>

                <div
                  className="track-pickup-line"
                  aria-hidden="true"
                />


                {isReady ? (
                  <>

                    <div className="track-pickup-ready">

                      <span aria-hidden="true">
                        <Check
                          size={13}
                          strokeWidth={2}
                        />
                      </span>

                      <strong>
                        READY FOR YOU
                      </strong>

                    </div>

                    <p>
                      Your order is ready.
                      Please head to JAZI and
                      have your order number
                      ready.
                    </p>

                  </>
                ) : isCompleted ? (
                  <>

                    <div className="track-pickup-ready">

                      <span aria-hidden="true">
                        <Check
                          size={13}
                          strokeWidth={2}
                        />
                      </span>

                      <strong>
                        COLLECTED
                      </strong>

                    </div>

                    <p>
                      This order has been
                      successfully collected.
                    </p>

                  </>
                ) : isCancelled ? (
                  <p>
                    This order has been
                    cancelled.
                  </p>
                ) : (
                  <p>
                    We’ll update this page when
                    your order is ready for
                    collection.
                  </p>
                )}


                <div className="track-pickup-order">

                  <span>
                    ORDER NUMBER
                  </span>

                  <strong>
                    #{order.order_number}
                  </strong>

                </div>

              </aside>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}


export default TrackOrder;