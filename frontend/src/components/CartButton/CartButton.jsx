import { ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";
import "./CartButton.css";

function CartButton({ onClick }) {
  const { cartCount } = useCart();

  return (
    <button
      type="button"
      className="cart-button"
      onClick={onClick}
      aria-label="Open your order"
    >
      <ShoppingBag
        size={20}
        strokeWidth={1.7}
        aria-hidden="true"
      />

      {cartCount > 0 && (
        <span className="cart-button-count">
          {cartCount}
        </span>
      )}
    </button>
  );
}

export default CartButton;