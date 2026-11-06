import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
  LoaderCircle,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/websiteApi";

import "./Checkout.css";


function Checkout() {
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [orderCompleted, setOrderCompleted] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    note: "",
  });


  /* =========================
     FORM CHANGE
     ========================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  /* =========================
     SUBMIT ORDER
     ========================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const orderData = {
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        note: form.note.trim(),

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const order =
        await createOrder(orderData);

      setOrderCompleted(true);

      clearCart();

      navigate(
        `/order-confirmation/${order.id}`,
        {
          replace: true,
          state: {
            order,
          },
        }
      );
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      let message =
        "Something went wrong. Please try again.";

      if (error?.items) {
        message = Array.isArray(error.items)
          ? error.items.join(" ")
          : String(error.items);
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }


  /*
    بعد نجاح الطلب نقوم بتفريغ السلة.
    لذلك لا نعيد المستخدم إلى Menu إذا كان
    الطلب قد اكتمل بالفعل.
  */

  if (
    cartItems.length === 0 &&
    !orderCompleted
  ) {
    return (
      <Navigate
        to="/menu"
        replace
      />
    );
  }


  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =========================
            HEADER
            ========================= */}

        <header className="checkout-header">

          <span>
            COMPLETE YOUR ORDER
          </span>

          <h1>
            Checkout
          </h1>

          <div
            className="checkout-decoration"
            aria-hidden="true"
          >
            <span />
            <i />
            <span />
          </div>

          <p>
            Enter your details below and we’ll
            prepare your order for pickup.
          </p>

        </header>


        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >

          {/* =========================
              LEFT SIDE
              ========================= */}

          <div className="checkout-details">

            {/* =========================
                CONTACT INFORMATION
                ========================= */}

            <section className="checkout-section">

              <div className="checkout-section-heading">

                <span>
                  01
                </span>

                <div>
                  <small>
                    YOUR DETAILS
                  </small>

                  <h2>
                    Contact Information
                  </h2>
                </div>

              </div>


              <div className="checkout-fields">

                <label className="checkout-field">

                  <span>
                    Name *
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    disabled={submitting}
                  />

                </label>


                <label className="checkout-field">

                  <span>
                    Phone Number *
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+971"
                    required
                    disabled={submitting}
                  />

                </label>


                <label
                  className="
                    checkout-field
                    checkout-field-full
                  "
                >

                  <span>
                    Order Note
                  </span>

                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Any special notes for your order?"
                    rows="4"
                    disabled={submitting}
                  />

                </label>

              </div>

            </section>


            {/* =========================
                PICKUP
                ========================= */}

            <section className="checkout-section">

              <div className="checkout-section-heading">

                <span>
                  02
                </span>

                <div>
                  <small>
                    ORDER METHOD
                  </small>

                  <h2>
                    Pickup
                  </h2>
                </div>

              </div>


              <div className="checkout-option selected">

                <div
                  className="checkout-option-icon"
                  aria-hidden="true"
                >
                  <Check
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <strong>
                    Pickup at JAZI
                  </strong>

                  <p>
                    We’ll prepare your order and
                    let you know when it’s ready.
                  </p>

                </div>

              </div>

            </section>


            {/* =========================
                PAYMENT
                ========================= */}

            <section className="checkout-section">

              <div className="checkout-section-heading">

                <span>
                  03
                </span>

                <div>
                  <small>
                    PAYMENT
                  </small>

                  <h2>
                    Payment Method
                  </h2>
                </div>

              </div>


              <div className="checkout-option selected">

                <div
                  className="checkout-option-icon"
                  aria-hidden="true"
                >
                  <Check
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <strong>
                    Cash on Pickup
                  </strong>

                  <p>
                    Pay at the restaurant when
                    collecting your order.
                  </p>

                </div>

              </div>

            </section>

          </div>


          {/* =========================
              RIGHT SIDE
              ========================= */}

          <aside className="checkout-summary">

            <span className="checkout-summary-eyebrow">
              YOUR ORDER
            </span>

            <h2>
              Order Summary
            </h2>

            <div
              className="checkout-summary-line"
              aria-hidden="true"
            />


            {/* =========================
                PRODUCTS
                ========================= */}

            <div className="checkout-summary-items">

              {cartItems.map((item) => (
                <article
                  className="checkout-summary-item"
                  key={item.id}
                >

                  <div className="checkout-summary-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>
                        JAZI
                      </span>
                    )}

                    <strong>
                      {item.quantity}
                    </strong>

                  </div>


                  <div className="checkout-summary-info">

                    <h3>
                      {item.name}
                    </h3>

                    <span>
                      {Number(
                        item.price
                      ).toFixed(0)}{" "}
                      AED
                    </span>

                  </div>


                  <strong className="checkout-summary-price">

                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(0)}

                    <small>
                      AED
                    </small>

                  </strong>

                </article>
              ))}

            </div>


            {/* =========================
                TOTAL
                ========================= */}

            <div className="checkout-total">

              <div>

                <span>
                  Total
                </span>

                <small>
                  VAT inclusive
                </small>

              </div>


              <strong>

                {cartTotal.toFixed(0)}

                <small>
                  AED
                </small>

              </strong>

            </div>


            {/* =========================
                ERROR
                ========================= */}

            {error && (
              <div
                className="checkout-error"
                role="alert"
              >
                {error}
              </div>
            )}


            {/* =========================
                CONFIRM ORDER
                ========================= */}

            <button
              type="submit"
              className="checkout-confirm"
              disabled={submitting}
            >

              <span>
                {submitting
                  ? "PLACING ORDER..."
                  : "CONFIRM ORDER"}
              </span>


              {submitting ? (
                <LoaderCircle
                  className="checkout-loading-icon"
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  size={18}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              )}

            </button>


            <p className="checkout-confirm-note">
              Pickup · Cash on Pickup
            </p>

          </aside>

        </form>

      </div>

    </main>
  );
}


export default Checkout;