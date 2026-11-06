import { ArrowRight } from "lucide-react";

import { useCart } from "../../context/CartContext";
import "./FloatingOrder.css";


function FloatingOrder({ onClick }) {
  const { cartCount, cartTotal } = useCart();

  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="floating-order-wrapper">
      <button
        type="button"
        className="floating-order"
        onClick={onClick}
        aria-label={`Open your order with ${cartCount} ${
          cartCount === 1 ? "item" : "items"
        }`}
      >
        <div className="floating-order-left">

          <span className="floating-order-count">
            {cartCount}
          </span>

          <div className="floating-order-text">
            <span>YOUR ORDER</span>

            <small>
              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}
            </small>
          </div>

        </div>


        <div className="floating-order-right">

          <div className="floating-order-total">
            <span>
              {cartTotal.toFixed(0)}
            </span>

            <small>AED</small>
          </div>


          <span className="floating-order-arrow">
            <ArrowRight
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

        </div>
      </button>
    </div>
  );
}


export default FloatingOrder;