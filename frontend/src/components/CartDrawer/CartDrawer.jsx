import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./CartDrawer.css";


function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  /* =========================
     CHECKOUT
     ========================= */

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }


  /* =========================
     CLOSE WITH ESC
     ========================= */

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);


  /* =========================
     LOCK PAGE SCROLL
     ========================= */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  return (
    <>
      {/* =========================
          OVERLAY
          ========================= */}

      <div
        className={`cart-overlay ${
          isOpen ? "open" : ""
        }`}
        onClick={onClose}
      />


      {/* =========================
          DRAWER
          ========================= */}

      <aside
        className={`cart-drawer ${
          isOpen ? "open" : ""
        }`}
        aria-hidden={!isOpen}
      >

        {/* =========================
            HEADER
            ========================= */}

        <div className="cart-drawer-header">
          <div>
            <span>YOUR ORDER</span>
            <h2>Order Summary</h2>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X
              size={19}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>
        </div>


        <div className="cart-header-line">
          <span />
          <i />
          <span />
        </div>


        {/* =========================
            CONTENT
            ========================= */}

        <div className="cart-drawer-content">

          {cartItems.length === 0 ? (

            /* EMPTY CART */

            <div className="cart-empty">

              <div className="cart-empty-icon">
                <ShoppingBag
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              <span>JAZI</span>

              <h3>Your order is empty</h3>

              <p>
                Explore our menu and add your
                favourite dishes to your order.
              </p>

              <button
                type="button"
                className="cart-browse-button"
                onClick={onClose}
              >
                <span>BROWSE MENU</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>

            </div>

          ) : (

            /* CART ITEMS */

            <div className="cart-items">

              {cartItems.map((item) => (

                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* IMAGE */}

                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>JAZI</span>
                    )}
                  </div>


                  {/* INFO */}

                  <div className="cart-item-info">

                    <div className="cart-item-top">

                      <div>
                        <h3>
                          {item.name}
                        </h3>

                        <span className="cart-item-unit-price">
                          {Number(
                            item.price
                          ).toFixed(0)}{" "}
                          AED
                        </span>
                      </div>


                      {/* REMOVE */}

                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <Trash2
                          size={15}
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </button>

                    </div>


                    {/* =========================
                        ITEM BOTTOM
                        ========================= */}

                    <div className="cart-item-bottom">

                      {/* QUANTITY */}

                      <div className="cart-quantity">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus
                            size={13}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </button>


                        <span>
                          {item.quantity}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus
                            size={13}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </button>

                      </div>


                      {/* ITEM TOTAL */}

                      <strong>
                        {(
                          Number(
                            item.price
                          ) *
                          item.quantity
                        ).toFixed(0)}{" "}

                        <small>
                          AED
                        </small>
                      </strong>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>


        {/* =========================
            FOOTER
            ========================= */}

        {cartItems.length > 0 && (

          <div className="cart-drawer-footer">

            <div className="cart-total">

              <div>
                <span>TOTAL</span>

                <small>
                  VAT inclusive
                </small>
              </div>


              <strong>
                {cartTotal.toFixed(0)}

                <span>
                  AED
                </span>
              </strong>

            </div>


            {/* CHECKOUT */}

            <button
              type="button"
              className="cart-checkout-button"
              onClick={handleCheckout}
            >
              <span>
                CHECKOUT
              </span>

              <ArrowRight
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </button>


            <p>
              Pickup · Cash on Pickup
            </p>

          </div>

        )}

      </aside>
    </>
  );
}


export default CartDrawer;