import {
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
} from "lucide-react";

import "./OrderConfirmation.css";


function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;


  /* =========================
     INVALID ORDER
     ========================= */

  if (!order) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return (
    <main className="confirmation-page">

      <div className="confirmation-card">

        {/* =========================
            SUCCESS ICON
            ========================= */}

        <div
          className="confirmation-check"
          aria-hidden="true"
        >
          <Check
            size={30}
            strokeWidth={1.8}
          />
        </div>


        {/* =========================
            HEADER
            ========================= */}

        <span className="confirmation-eyebrow">
          ORDER RECEIVED
        </span>

        <h1>
          Thank You
        </h1>

        <p className="confirmation-message">
          Your order has been received and will be
          prepared for pickup.
        </p>


        {/* =========================
            ORDER NUMBER
            ========================= */}

        <div className="confirmation-number">

          <span>
            YOUR ORDER NUMBER
          </span>

          <strong>
            #{order.order_number}
          </strong>

          <small>
            Keep this number to track your order
          </small>

        </div>


        {/* =========================
            ORDER DETAILS
            ========================= */}

        <div className="confirmation-details">

          <div>
            <span>
              Status
            </span>

            <strong>
              Pending
            </strong>
          </div>


          <div>
            <span>
              Total
            </span>

            <strong>
              {Number(order.total).toFixed(0)} AED
            </strong>
          </div>


          <div>
            <span>
              Payment
            </span>

            <strong>
              Cash on Pickup
            </strong>
          </div>

        </div>


        {/* =========================
            TRACK ORDER
            ========================= */}

        <Link
          to="/track-order"
          state={{
            orderId: order.order_number,
            phone: order.phone,
          }}
          className="confirmation-track"
        >

          <span>
            TRACK YOUR ORDER
          </span>

          <ArrowRight
            size={18}
            strokeWidth={1.7}
            aria-hidden="true"
          />

        </Link>


        {/* =========================
            HOME
            ========================= */}

        <Link
          to="/"
          className="confirmation-home"
        >
          Return to Home
        </Link>

      </div>

    </main>
  );
}


export default OrderConfirmation;